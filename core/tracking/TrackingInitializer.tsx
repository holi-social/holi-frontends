import { ApolloClient, ReactiveVar, makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import React, { memo, useEffect, useMemo } from 'react'

import {
  LoginStateChangeListener,
  listenOnLoginStateChange,
  loginState,
  loginStateUnknown,
} from '@holi/core/auth/loginState'
import { AuthenticatedUserV2Response, authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { AuthenticatedUser } from '@holi/core/domain/shared/types'
import { isApp } from '@holi/core/helpers/isApp'
import { isSSR } from '@holi/core/helpers/isSSR'
import { getLogger } from '@holi/core/helpers/logging'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { consentStore } from '@holi/core/tracking/ConsentStore'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import { Consent, ConsentState, PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

class Tracking {
  constructor(private posthog: PosthogCrossPlatform, private apollo: ApolloClient<object>) {}

  public async initWithLoggedInUser(user: AuthenticatedUser): Promise<void> {
    const consentState = ConsentState.fromUser(user)
    switch (consentState[TrackingPurpose.Analytics]) {
      case Consent.Given:
        logger.debug('TrackingInitializer.initWithLoggedInUser', 'analytics consent given, opting in on posthog client')
        await this.posthog.optIn()
        logger.debug('TrackingInitializer.initWithLoggedInUser', 'identifying user on posthog client')
        this.posthog.identify(user.id, {
          isEmployee: user.isEmployee,
          trackingConsentAnalytics: Consent.toBooleanOrNull(consentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBooleanOrNull(consentState[TrackingPurpose.Personalization]),
        })
        break
      case Consent.Unknown:
      case Consent.Denied:
        logger.debug(
          'TrackingInitializer.initWithLoggedInUser',
          'analytics consent NOT given, opting out on posthog client'
        )
        await this.posthog.optOut()
        break
    }
  }

  public async initWithLoggedOutUser(consentState: ConsentState): Promise<void> {
    switch (consentState[TrackingPurpose.Analytics]) {
      case Consent.Given:
        logger.debug(
          'TrackingInitializer.initWithLoggedOutUser',
          'analytics consent given, opting in on posthog client'
        )
        await this.posthog.optIn()
        break
      case Consent.Unknown:
      case Consent.Denied:
        logger.debug(
          'TrackingInitializer.initWithLoggedOutUser',
          'analytics consent NOT given, opting out on posthog client'
        )
        await this.posthog.optOut()
        break
    }
  }

  public async clearConsentAfterUserLoggedOut(): Promise<void> {
    try {
      await consentStore.clear()
      logger.debug('TrackingInitializer.clearConsentAfterUserLoggedOut', 'cleared consentStore')
    } finally {
      this.posthog.reset()
      logger.debug('TrackingInitializer.clearConsentAfterUserLoggedOut', 'posthog reset')
    }
  }

  public async loadConsentStateFromLocalStorage(): Promise<ConsentState> {
    const consentState = await consentStore.load()
    logger.debug(
      'TrackingInitializer.loadConsentStateFromLocalStorage',
      'loaded consent from local storage',
      consentState
    )
    return consentState
  }

  public async fetchAuthenticatedUser(): Promise<AuthenticatedUser> {
    const response = await this.apollo.query<AuthenticatedUserV2Response>({
      query: authenticatedUserV2Query,
    })
    logger.debug('TrackingInitializer.fetchAuthenticatedUser', 'fetched authenticated user')
    return response.data.authenticatedUserV2
  }

  public async updateConsentOnLocalStorage(consentState: ConsentState): Promise<void> {
    await consentStore.store(consentState)
    logger.debug('TrackingInitializer.updateConsent', 'persisted updated consent')
  }

  public async updateConsentOnUserProfile(consentState: ConsentState): Promise<AuthenticatedUser> {
    const response = await this.apollo.mutate<
      UpdateAuthenticatedUserV2Response,
      { input: Partial<UpdateAuthenticatedUserInput> }
    >({
      mutation: updateAuthenticatedUserV2Mutation,
      variables: {
        input: {
          trackingConsentAnalytics: Consent.toBooleanOrNull(consentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBooleanOrNull(consentState[TrackingPurpose.Personalization]),
        },
      },
    })
    logger.debug('TrackingInitializer.updateConsentOnUserProfile', 'updated consent on user profile')
    if (response.data?.updateAuthenticatedUserV2) return response.data?.updateAuthenticatedUserV2
    else throw new Error('updateAuthenticatedUserV2Mutation response did not contain updated authenticatedUser')
  }
}

/**
 * InitializerState models the state used for the internal state of a state machine, representing states and transitions
 * for the consent. (Side) Effects are executed as part of transitions, putting local storage / user profile and posthog
 * into the desired states.
 *
 * ┌──────────────┐ userLoggedIn ┌────────┐
 * │ initializing ├───────────┐  │        │
 * └─┬────────────┘           │  │        │consentUpdatedByUser
 *   │                      ┌─▼──┴─────┐  │
 *   │                  ┌──►│ loggedIn │◄─┘
 *   │                  │   └────┬─────┘
 *   │                  │        │
 *   │                  │        │
 *   │                  │        │
 *   │                  │        │userLoggedOut
 *   │                  │        │
 *   │      userLoggedIn│        │
 *   │                  │        │
 *   │                  │        │
 *   │                  │        │    ┌────┐
 *   │                  │        │    │    │consentUpdatedByUser
 *   │                  │   ┌────▼────┴─┐  │
 *   │                  └───┤ loggedOut │◄─┘
 *   │                      └──▲────────┘
 *   │userLoggedOut            │
 *   └─────────────────────────┘
 */
interface InitializerState {
  state:
    | 'initializing' /* set when the application initializes for "the first time" (but e.g. also on browser reload) */
    | 'loggedIn' /* set when the user is logged in */
    | 'loggedOut' /* set when the user is logged out */
  processing:
    | null /* set when no state transition is in progress */
    | { trigger: 'userLoggedIn' } /* transition triggered when user logged in */
    | { trigger: 'userLoggedOut' } /* transition triggered when user logged out */
    | {
        trigger: 'consentUpdatedByUser'
        newConsentState: ConsentState
      } /* transition triggered when user updates their consent */
}

/** internal use only! only exported for reset in testing */
export const initialState: InitializerState = {
  state: 'initializing',
  processing: null,
}

const initializerStateVar: ReactiveVar<InitializerState> = makeVar<InitializerState>(initialState)

const consentStateVar: ReactiveVar<[ConsentState, { loading: boolean }]> = makeVar<
  [ConsentState, { loading: boolean }]
>([ConsentState.unknown, { loading: true }])

/** to be called by UI components when the user updates their consent */
export const updateConsentState = (newConsentState: ConsentState) => {
  const currentState = initializerStateVar()
  initializerStateVar({
    state: currentState.state,
    processing: { trigger: 'consentUpdatedByUser', newConsentState: newConsentState },
  })
}

export const useConsentState = (): [ConsentState, { loading: boolean }] => useReactiveVar(consentStateVar)

export const getConsentState = (): ConsentState => consentStateVar()[0]

export interface TrackingInitializerProps extends TrackingInitializerInnerProps {
  /** used for unit testing to enable tracking even though not running on client side */
  enableTracking?: boolean
}

const TrackingInitializer = ({
  enableTracking,
  onUpdateCompleted,
  onUserLoggedInCompleted,
  onUserLoggedOutCompleted,
}: TrackingInitializerProps) => {
  const isWebClientSide = !isSSR
  const init = enableTracking || isApp || isWebClientSide
  return init ? (
    <TrackingInitializerInner
      onUpdateCompleted={onUpdateCompleted}
      onUserLoggedInCompleted={onUserLoggedInCompleted}
      onUserLoggedOutCompleted={onUserLoggedOutCompleted}
    />
  ) : null
}

interface TrackingInitializerInnerProps {
  onUpdateCompleted?: () => void
  onUserLoggedInCompleted?: () => void
  onUserLoggedOutCompleted?: () => void
}

const TrackingInitializerInner = ({
  onUpdateCompleted,
  onUserLoggedInCompleted,
  onUserLoggedOutCompleted,
}: TrackingInitializerInnerProps) => {
  const posthog: PosthogCrossPlatform = usePosthogCrossPlatform()
  const apollo: ApolloClient<object> = useApolloClient()
  const tracking = useMemo(() => new Tracking(posthog, apollo), [posthog, apollo])
  const state = useReactiveVar(initializerStateVar)

  useEffect(() => {
    const loginStateChangeListener: LoginStateChangeListener = (curState, prevState) => {
      if (curState.isLoggedIn) {
        logger.debug('TrackingInitializer', 'detected user login')
        const currentState = initializerStateVar()
        initializerStateVar({
          state: currentState.state,
          processing: { trigger: 'userLoggedIn' },
        })
      } else if (curState.isLoggedOut && prevState?.isLoggedOut === false) {
        logger.debug('TrackingInitializer', 'detected user logout')
        const currentState = initializerStateVar()
        initializerStateVar({
          state: currentState.state,
          processing: { trigger: 'userLoggedOut' },
        })
      }
    }
    // ensure that initial state (which was maybe already executed before registering the listener) is reflected in
    // TrackingInitializers internal state
    loginStateChangeListener(loginState(), loginStateUnknown)

    // noinspection UnnecessaryLocalVariableJS
    const unsubscribe = listenOnLoginStateChange(loginStateChangeListener)
    return unsubscribe
  }, [])

  useEffect(() => {
    if (state.processing) {
      logger.debug('TrackingInitializer', 'processing state transition', JSON.stringify(state))
      switch (state.state) {
        case 'initializing':
          switch (state.processing.trigger) {
            case 'userLoggedIn':
              tracking
                .fetchAuthenticatedUser()
                .then((au) => {
                  tracking.initWithLoggedInUser(au)
                  consentStateVar([ConsentState.fromUser(au), { loading: false }])
                })
                .then(() => {
                  initializerStateVar({
                    state: 'loggedIn',
                    processing: null,
                  })
                  onUserLoggedInCompleted?.()
                })
              break
            case 'userLoggedOut':
              tracking
                .loadConsentStateFromLocalStorage()
                .then((cs) => {
                  tracking.initWithLoggedOutUser(cs)
                  consentStateVar([cs, { loading: false }])
                })
                .then(() => {
                  initializerStateVar({
                    state: 'loggedOut',
                    processing: null,
                  })
                  onUserLoggedOutCompleted?.()
                })
              break
            case 'consentUpdatedByUser':
              throw new Error('It should not be able to update consent state during app initialization')
          }
          break
        case 'loggedIn':
          switch (state.processing.trigger) {
            case 'userLoggedIn':
              initializerStateVar({
                state: 'loggedIn',
                processing: null,
              })
              break
            case 'userLoggedOut':
              tracking
                .clearConsentAfterUserLoggedOut()
                .then(() => {
                  tracking.initWithLoggedOutUser(ConsentState.unknown)
                  consentStateVar([ConsentState.unknown, { loading: false }])
                })
                .then(() => {
                  initializerStateVar({
                    state: 'loggedOut',
                    processing: null,
                  })
                  onUserLoggedOutCompleted?.()
                })
              break
            case 'consentUpdatedByUser':
              tracking
                .updateConsentOnUserProfile(state.processing.newConsentState)
                .then((au) => {
                  tracking.initWithLoggedInUser(au)
                  consentStateVar([ConsentState.fromUser(au), { loading: false }])
                })
                .then(() => {
                  initializerStateVar({
                    state: 'loggedIn',
                    processing: null,
                  })
                  onUpdateCompleted?.()
                })
              break
          }
          break
        case 'loggedOut':
          switch (state.processing.trigger) {
            case 'userLoggedIn':
              tracking.fetchAuthenticatedUser().then((authenticatedUser) => {
                const consentStateFromUserProfile = ConsentState.fromUser(authenticatedUser)
                const maybeMigrateConsentStateToUserProfile = ConsentState.isUnknown(consentStateFromUserProfile)
                  ? tracking.loadConsentStateFromLocalStorage().then((csls) => {
                      logger.debug('TrackingInitializer.userLoggedIn', 'migrating local consent to user profile')
                      return tracking.updateConsentOnUserProfile(csls)
                    })
                  : Promise.resolve(authenticatedUser)
                maybeMigrateConsentStateToUserProfile
                  .then((maybeMigratedUser) => {
                    tracking.initWithLoggedInUser(maybeMigratedUser)
                    consentStateVar([ConsentState.fromUser(maybeMigratedUser), { loading: false }])
                  })
                  .then(() => {
                    initializerStateVar({
                      state: 'loggedIn',
                      processing: null,
                    })
                    onUserLoggedInCompleted?.()
                  })
              })
              break
            case 'userLoggedOut':
              initializerStateVar({
                state: 'loggedOut',
                processing: null,
              })
              break
            case 'consentUpdatedByUser':
              {
                const newConsentState = state.processing.newConsentState
                tracking
                  .updateConsentOnLocalStorage(newConsentState)
                  .then(() => {
                    tracking.initWithLoggedOutUser(newConsentState)
                    consentStateVar([newConsentState, { loading: false }])
                  })
                  .then(() => {
                    initializerStateVar({
                      state: 'loggedOut',
                      processing: null,
                    })
                    onUpdateCompleted?.()
                  })
              }
              break
          }
          break
      }
    }
  }, [tracking, state, onUpdateCompleted, onUserLoggedInCompleted, onUserLoggedOutCompleted])

  return null
}

export default memo(TrackingInitializer)

export const exportedForTesting = {
  initializerStateVar,
  consentStateVar,
}
