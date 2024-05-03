import { ApolloClient, makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import React, { memo, useEffect, useMemo } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'
import { LoggedInState, useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { consentStore } from '@holi/core/tracking/ConsentStore'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import { trackingEnabled } from '@holi/core/tracking/config'
import { Consent, ConsentState, PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

class Tracking {
  constructor(private posthog: PosthogCrossPlatform, private apollo: ApolloClient<object>) {}

  public async init(loggedInState: LoggedInState, consentState?: ConsentState): Promise<void> {
    const state = consentState ?? (await this.loadConsent(loggedInState))
    if (loggedInState.isLoggedIn) {
      logger.debug('TrackingInitializer', 'initializing for logged-in user', state)
      await this.initWithLoggedInUser(loggedInState.user, state)
    } else if (loggedInState.isLoggedOut) {
      logger.debug('TrackingInitializer', 'initializing for logged-out user', state)
      await this.initWithLoggedOutUser(state)
    }
  }

  private async initWithLoggedInUser(user: AuthenticatedUser, consentState: ConsentState): Promise<void> {
    switch (consentState[TrackingPurpose.Analytics]) {
      case Consent.Given:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent given, opting in on posthog client')
        await this.posthog.optIn()
        logger.debug('TrackingInitializer.userLoggedIn', 'identifying user on posthog client')
        this.posthog.identify(user.id)
        break
      case Consent.Unknown:
      case Consent.Denied:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent NOT given, opting out on posthog client')
        await this.posthog.optOut()
        break
    }
  }

  private async initWithLoggedOutUser(consentState: ConsentState): Promise<void> {
    switch (consentState[TrackingPurpose.Analytics]) {
      case Consent.Given:
        logger.debug('TrackingInitializer.userLoggedOut', 'analytics consent given, opting in on posthog client')
        await this.posthog.optIn()
        break
      case Consent.Unknown:
      case Consent.Denied:
        logger.debug('TrackingInitializer.userLoggedOut', 'analytics consent NOT given, opting out on posthog client')
        await this.posthog.optOut()
        break
    }
  }

  public async clearConsentAfterUserLoggedOut(): Promise<void> {
    const errorContext = { location: 'useTracking.userLoggedOut' }
    return consentStore
      .clear()
      .then(() => logger.debug('TrackingInitializer.userLoggedOut', 'cleared consentStore'))
      .catch((error) => logError(error, 'Failed to clear tracking consent', errorContext))
      .finally(() => this.posthog.reset())
      .then(() => logger.debug('TrackingInitializer.userLoggedOut', 'posthog reset'))
      .catch((error) => logError(error, 'Failed to reset Posthog client', errorContext))
  }

  public async loadConsent(loggedInState: LoggedInState): Promise<ConsentState> {
    return loggedInState.isLoggedIn ? ConsentState.fromUser(loggedInState.user) : await consentStore.load()
  }

  public storeConsent(loggedInState: LoggedInState, consentState: ConsentState): Promise<void> {
    const errorContext = { location: 'TrackingInitializer.updateConsent' }
    const store = !loggedInState.isLoggedIn
      ? consentStore.store(consentState)
      : this.updateConsentOnUserProfile(consentState)
    return store
      .then(() => logger.debug('TrackingInitializer.updateConsent', 'persisted updated consent'))
      .catch((error) => logError(error, 'Failed to store given tracking consent', errorContext))
  }

  private async updateConsentOnUserProfile(consentState: ConsentState): Promise<void> {
    await this.apollo.mutate<UpdateAuthenticatedUserV2Response, { input: Partial<UpdateAuthenticatedUserInput> }>({
      mutation: updateAuthenticatedUserV2Mutation,
      variables: {
        input: {
          trackingConsentAnalytics: Consent.toBoolean(consentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBoolean(consentState[TrackingPurpose.Personalization]),
        },
      },
    })
  }
}

// internal use only! only exported for reset in testing
export const consentStateVarInitial = {
  initializing: true, // true when the application initializes for "the first time" (but e.g. also on browser reload)
  updatedByUser: false, // true for every subsequent update to consentStateVar (typically when user updates consent)
  userLoggedIn: false, // true when the user just logged in
  userLoggedOut: false, // true when the user just logged out
  state: ConsentState.unknown,
}

// internal use only! only exported for reset in testing
export const consentStateVar = makeVar<{
  initializing: boolean
  updatedByUser: boolean
  userLoggedIn: boolean
  userLoggedOut: boolean
  state: ConsentState
}>(consentStateVarInitial)

export const updateConsentState = (consentState: ConsentState) => {
  consentStateVar({
    initializing: false,
    updatedByUser: true,
    userLoggedIn: false,
    userLoggedOut: false,
    state: consentState,
  })
}

export const userLoggedIn = (): void => {
  consentStateVar({
    initializing: false,
    updatedByUser: false,
    userLoggedIn: true,
    userLoggedOut: false,
    state: ConsentState.unknown,
  })
}

export const userLoggedOut = (): void => {
  consentStateVar({
    initializing: false,
    updatedByUser: false,
    userLoggedIn: false,
    userLoggedOut: true,
    state: ConsentState.unknown,
  })
}

export type TrackingInitializerProps = {
  enableTracking?: boolean
  onInitCompleted?: (...args: unknown[]) => void
  onUpdateCompleted?: (...args: unknown[]) => void
  onUserLoggedInCompleted?: (...args: unknown[]) => void
  onUserLoggedOutCompleted?: (...args: unknown[]) => void
}

const TrackingInitializer = ({
  enableTracking,
  onInitCompleted,
  onUpdateCompleted,
  onUserLoggedInCompleted,
  onUserLoggedOutCompleted,
}: TrackingInitializerProps) => {
  // don't initialize for SSR
  const init = enableTracking || (typeof navigator !== 'undefined' && trackingEnabled())
  return init ? (
    <TrackingInitializerInner
      onInitCompleted={onInitCompleted}
      onUpdateCompleted={onUpdateCompleted}
      onUserLoggedInCompleted={onUserLoggedInCompleted}
      onUserLoggedOutCompleted={onUserLoggedOutCompleted}
    />
  ) : null
}

type TrackingInitializerInnerProps = {
  onInitCompleted?: (...args: unknown[]) => void
  onUpdateCompleted?: (...args: unknown[]) => void
  onUserLoggedInCompleted?: (...args: unknown[]) => void
  onUserLoggedOutCompleted?: (...args: unknown[]) => void
}

const TrackingInitializerInner = ({
  onInitCompleted,
  onUpdateCompleted,
  onUserLoggedInCompleted,
  onUserLoggedOutCompleted,
}: TrackingInitializerInnerProps) => {
  const posthog: PosthogCrossPlatform = usePosthogCrossPlatform()
  const apollo: ApolloClient<object> = useApolloClient()
  const tracking = useMemo(() => new Tracking(posthog, apollo), [posthog, apollo])
  const loggedInState = useLoggedInUser()
  const consentState = useReactiveVar(consentStateVar)

  // TODO HOLI-8173 migrate consent state from localstorage to user profile if unknown in profile
  useEffect(() => {
    if (loggedInState.isLoggedIn || loggedInState.isLoggedOut) {
      if (consentState.initializing) {
        logger.debug('TrackingInitializer', 'initializing', consentState)
        tracking.init(loggedInState).then(() => {
          consentStateVar({
            initializing: false,
            updatedByUser: false,
            userLoggedIn: false,
            userLoggedOut: false,
            state: consentState.state,
          })
          if (onInitCompleted) onInitCompleted()
        })
      } else if (consentState.updatedByUser) {
        logger.debug('TrackingInitializer', 'user updated consent', consentState)
        tracking.storeConsent(loggedInState, consentState.state).then(() => {
          tracking.init(loggedInState, consentState.state).then(() => {
            consentStateVar({
              initializing: false,
              updatedByUser: false,
              userLoggedIn: false,
              userLoggedOut: false,
              state: consentState.state,
            })
            if (onUpdateCompleted) onUpdateCompleted()
          })
        })
      } else if (consentState.userLoggedIn) {
        logger.debug('TrackingInitializer', 'userLoggedIn', consentState)
        tracking.init(loggedInState).then(() => {
          consentStateVar({
            initializing: false,
            updatedByUser: false,
            userLoggedIn: false,
            userLoggedOut: false,
            state: consentState.state,
          })
          if (onUserLoggedInCompleted) onUserLoggedInCompleted()
        })
      } else if (consentState.userLoggedOut) {
        logger.debug('TrackingInitializer', 'userLoggedOut', consentState)
        tracking.clearConsentAfterUserLoggedOut().then(() => {
          return tracking.init(loggedInState).then(() => {
            consentStateVar({
              initializing: false,
              updatedByUser: false,
              userLoggedIn: false,
              userLoggedOut: false,
              state: consentState.state,
            })
            if (onUserLoggedOutCompleted) onUserLoggedOutCompleted()
          })
        })
      }
    }
  }, [
    loggedInState,
    tracking,
    consentState,
    onInitCompleted,
    onUpdateCompleted,
    onUserLoggedInCompleted,
    onUserLoggedOutCompleted,
  ])

  return null
}

export default memo(TrackingInitializer)
