import { ApolloClient, useApolloClient } from '@apollo/client'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateAuthenticatedUserMutation,
} from '@holi/core/screens/userprofile/queries'
import { LoggedInState, LoggedInUser, useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { consentStore } from '@holi/core/tracking/consent_store'
import { TrackingEvent } from '@holi/core/tracking/events'
import { usePosthogCrossPlatform } from '@holi/core/tracking/posthog_cross_platform'
import { Consent, ConsentState, PosthogCrossPlatform, TrackingHook, TrackingPurpose } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

class Tracking {
  constructor(private posthog: PosthogCrossPlatform, private apollo: ApolloClient<object>) {}

  public trackEvent = (event: TrackingEvent): void => {
    this.posthog.capture(event.name, event.properties)
  }

  public optIn = async () => {
    if (!this.posthog.optedIn()) return await this.posthog.optIn()
    else return Promise.resolve()
  }

  public optOut = async () => {
    if (this.posthog.optedIn()) return await this.posthog.optOut()
    else return Promise.resolve()
  }

  public appInit = async (loggedInState: LoggedInState): Promise<void> => {
    logger.debug('lifecycle.appInit', 'loggedInState=%s', loggedInState)
    const analyticsConsent = loggedInState.isLoggedIn
      ? Consent.fromBoolean(loggedInState.user.trackingConsentAnalytics)
      : (await consentStore.load())[TrackingPurpose.Analytics]
    if (analyticsConsent == Consent.Given) {
      logger.debug('lifecycle.appInit', 'analytics consent given, opting in on posthog client')
      await this.optIn()
      if (loggedInState.isLoggedIn) {
        logger.debug('lifecycle.appInit', 'identifying user on posthog client')
        this.posthog.identify(loggedInState.user.id)
      }
    } else {
      logger.debug('lifecycle.appInit', 'analytics consent NOT given, opting out on posthog client')
      await this.optOut()
    }
  }
  public userLoggedIn = (loggedInUser: LoggedInUser) => async (): Promise<void> => {
    logger.debug('lifecycle.userLoggedIn', 'loggedInUser=%s', loggedInUser)
    switch (Consent.fromBoolean(loggedInUser.user.trackingConsentAnalytics)) {
      case Consent.Given:
        logger.debug('lifecycle.userLoggedIn', 'analytics consent given, opting in on posthog client')
        await this.optIn()
        logger.debug('lifecycle.userLoggedIn', 'identifying user on posthog client')
        return this.posthog.identify(loggedInUser.user.id)
      case Consent.Unknown || Consent.Denied:
        logger.debug('lifecycle.userLoggedIn', 'analytics consent NOT given, opting out on posthog client')
        return await this.optOut()
    }
  }

  public userLoggedOut = (): Promise<void> => {
    const errorContext = { location: 'useTracking.userLoggedOut' }
    return consentStore
      .clear()
      .then(() => logger.debug('lifecycle.userLoggedOut', 'cleared consentStore'))
      .catch((error) => logError(error, 'Failed to clear tracking consent', errorContext))
      .finally(() => this.posthog.reset())
      .then(() => logger.debug('lifecycle.userLoggedOut', 'posthog reset'))
      .catch((error) => logError(error, 'Failed to reset Posthog client', errorContext))
  }

  public updateConsent = (loggedInState: LoggedInState, consentState: ConsentState): Promise<void> => {
    const errorContext = { location: 'useTracking.userGaveTrackingConsent' }
    const store = !loggedInState.isLoggedIn
      ? consentStore.store(consentState)
      : this.apollo.mutate<UpdateAuthenticatedUserResponse>({
          mutation: updateAuthenticatedUserMutation,
          variables: {
            trackingConsentAnalytics: Consent.toBoolean(consentState[TrackingPurpose.Analytics]),
            trackingConsentPersonalization: Consent.toBoolean(consentState[TrackingPurpose.Personalization]),
          } as UpdateAuthenticatedUserInput,
        })
    return store
      .then(() => logger.debug('lifecycle.userGaveTrackingConsent', 'persisted opt-in on consentStore'))
      .catch((error) => logError(error, 'Failed to store given tracking consent', errorContext))
      .then(() => this.optIn())
      .then(() => logger.debug('lifecycle.userGaveTrackingConsent', 'opted-in on Posthog client'))
      .catch((error) => logError(error, 'Failed to opt-in into tracking', errorContext))
  }
}

const useTracking = (): TrackingHook => {
  const posthog: PosthogCrossPlatform = usePosthogCrossPlatform()
  const apollo: ApolloClient<object> = useApolloClient()
  const tracking = new Tracking(posthog, apollo)
  const loggedInState = useLoggedInUser()
  return {
    trackEvent: tracking.trackEvent,
    lifecycle: {
      appInit: tracking.appInit,
      userLoggedIn: tracking.userLoggedIn(loggedInState as LoggedInUser),
      userLoggedOut: tracking.userLoggedOut,
      updateConsent: tracking.updateConsent,
    },
  }
}

export default useTracking
