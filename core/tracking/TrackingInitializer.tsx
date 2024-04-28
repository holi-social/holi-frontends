import { ApolloClient, makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import React, { PropsWithChildren, memo, useEffect, useMemo } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'
import { LoggedInState, useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { trackingEnabled } from '@holi/core/tracking/config'
import { consentStore } from '@holi/core/tracking/consent_store'
import { usePosthogCrossPlatform } from '@holi/core/tracking/posthog_cross_platform'
import { Consent, ConsentState, PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

class Tracking {
  constructor(private posthog: PosthogCrossPlatform, private apollo: ApolloClient<object>) {}

  public optIn = async () => {
    if (!this.posthog.optedIn()) return await this.posthog.optIn()
    else return Promise.resolve()
  }

  public optOut = async () => {
    if (this.posthog.optedIn()) return await this.posthog.optOut()
    else return Promise.resolve()
  }

  public init = async (loggedInState: LoggedInState, consentState?: ConsentState) => {
    if (loggedInState.isLoggedIn) {
      logger.debug('TrackingInitializer', 'login state loggedIn', JSON.stringify(loggedInState))
      return this.initWithLoggedInUser(loggedInState.user, consentState)
    } else if (loggedInState.isLoggedOut) {
      logger.debug('TrackingInitializer', 'login state loggedOut')
      return this.initWithLoggedOutUser(consentState)
    }
  }

  private initWithLoggedInUser = async (user: AuthenticatedUser, consentState?: ConsentState): Promise<void> => {
    logger.debug('TrackingInitializer.userLoggedIn', 'user=%s', user)
    const analyticsConsent = consentState
      ? consentState[TrackingPurpose.Analytics]
      : Consent.fromBoolean(user.trackingConsentAnalytics)
    switch (analyticsConsent) {
      case Consent.Given:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent given, opting in on posthog client')
        await this.optIn()
        logger.debug('TrackingInitializer.userLoggedIn', 'identifying user on posthog client')
        return this.posthog.identify(user.id)
      case Consent.Unknown || Consent.Denied:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent NOT given, opting out on posthog client')
        return await this.optOut()
    }
  }

  private initWithLoggedOutUser = async (consentState?: ConsentState): Promise<void> => {
    const analyticsConsent = consentState
      ? consentState[TrackingPurpose.Analytics]
      : (await consentStore.load())[TrackingPurpose.Analytics]
    switch (analyticsConsent) {
      case Consent.Given:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent given, opting in on posthog client')
        return await this.optIn()
      case Consent.Unknown || Consent.Denied:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent NOT given, opting out on posthog client')
        return await this.optOut()
    }
  }

  // TODO call this after user logged out
  public clearConsentAfterUserLoggedOut = async (): Promise<void> => {
    const errorContext = { location: 'useTracking.userLoggedOut' }
    return consentStore
      .clear()
      .then(() => logger.debug('TrackingInitializer.userLoggedOut', 'cleared consentStore'))
      .catch((error) => logError(error, 'Failed to clear tracking consent', errorContext))
      .finally(() => this.posthog.reset())
      .then(() => logger.debug('TrackingInitializer.userLoggedOut', 'posthog reset'))
      .catch((error) => logError(error, 'Failed to reset Posthog client', errorContext))
  }

  public loadConsent = (loggedInState: LoggedInState): Promise<ConsentState> => {
    return loggedInState.isLoggedIn
      ? Promise.resolve({
          [TrackingPurpose.Analytics]: Consent.fromBoolean(loggedInState.user.trackingConsentAnalytics),
          [TrackingPurpose.Personalization]: Consent.fromBoolean(loggedInState.user.trackingConsentPersonalization),
        } as ConsentState)
      : consentStore.load()
  }

  // TODO make this available to be called by frontend code
  // TODO how to act on updated consent store / user profile?
  public storeConsent = (loggedInState: LoggedInState, consentState: ConsentState): Promise<void> => {
    const errorContext = { location: 'TrackingInitializer.updateConsent' }
    const store = !loggedInState.isLoggedIn
      ? consentStore.store(consentState)
      : this.updateConsentOnUserProfile(consentState)
    return store
      .then(() => logger.debug('TrackingInitializer.updateConsent', 'persisted opt-in on consentStore'))
      .catch((error) => logError(error, 'Failed to store given tracking consent', errorContext))
      .then(() => this.optIn())
      .then(() => logger.debug('TrackingInitializer.updateConsent', 'opted-in on Posthog client'))
      .catch((error) => logError(error, 'Failed to opt-in into tracking', errorContext))
  }

  private updateConsentOnUserProfile = async (consentState: ConsentState): Promise<void> => {
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

const consentStateVar = makeVar<{ initializing: boolean; updatedByUser: boolean; state: ConsentState }>({
  initializing: true, // true when the application initializes for "the first time" (but e.g. also on browser reload)
  updatedByUser: false, // true for every subsequent update to consentStateVar (typically when user updates consent)
  state: ConsentState.unknown,
})

// TODO call this from consent setting dialogue
export const updateConsentState = (consentState: ConsentState) => {
  consentStateVar({ initializing: true, updatedByUser: true, state: consentState })
}

const TrackingInitializer = ({ children }: PropsWithChildren) => {
  // don't initialize for SSR
  const isClient: boolean = typeof navigator !== 'undefined'
  return trackingEnabled && isClient ? <TrackingInitializerInner>{children}</TrackingInitializerInner> : <>{children}</>
}

const TrackingInitializerInner = ({ children }: PropsWithChildren) => {
  const posthog: PosthogCrossPlatform = usePosthogCrossPlatform()
  const apollo: ApolloClient<object> = useApolloClient()
  const tracking = useMemo(() => new Tracking(posthog, apollo), [posthog, apollo])
  const loggedInState = useLoggedInUser()
  const consentState = useReactiveVar(consentStateVar)

  // TODO logout not handled (either load from localstorage or clear localstorage)
  // TODO migrate consent state from localstorage to user profile if unknown in profile
  useEffect(() => {
    logger.debug('TrackingInitializer', '', consentState)
    if (loggedInState.isLoggedIn || loggedInState.isLoggedOut) {
      if (consentState.initializing) {
        tracking.init(loggedInState).then(() => {
          consentStateVar({ initializing: false, updatedByUser: false, state: consentState.state })
        })
      } else if (consentState.updatedByUser) {
        logger.debug('TrackingInitializer', 'user updated consent %s', JSON.stringify(consentState.state))
        tracking.storeConsent(loggedInState, consentState.state).then(() => {
          tracking.init(loggedInState, consentState.state).then(() => {
            consentStateVar({ initializing: false, updatedByUser: false, state: consentState.state })
          })
        })
      }
    }
  }, [loggedInState, tracking, consentState])

  return <>{children}</>
}

export default memo(TrackingInitializer)
