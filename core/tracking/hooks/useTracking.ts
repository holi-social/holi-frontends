import { LoginState, useAuth } from '@holi/core/auth/helpers/useAuth'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { ConsentState, consentStore } from '@holi/core/tracking/consent_store'
import { TrackingEvent } from '@holi/core/tracking/events'
import { usePosthogCrossPlatform } from '@holi/core/tracking/posthog_cross_platform'
import { PosthogCrossPlatform, TrackingHook } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

const trackEvent =
  (posthog: PosthogCrossPlatform) =>
  (event: TrackingEvent): void => {
    posthog.capture(event.name, event.properties)
  }

const appInit =
  (posthog: PosthogCrossPlatform) =>
  async (loginState: LoginState): Promise<void> => {
    logger.debug('lifecycle.appInit', 'loginState=%s', loginState)
    const consent = await consentStore.getConsent(loginState.isLoggedIn)
    if (consent == ConsentState.Given) {
      logger.debug('lifecycle.appInit', 'consent given, opting in on posthog client')
      await posthog.optIn()
      if (loginState.isLoggedIn) {
        logger.debug('lifecycle.appInit', 'identifying user on posthog client')
        posthog.identify(loginState.userId)
      }
    } else {
      logger.debug('lifecycle.appInit', 'consent NOT given, opting out on posthog client')
      await posthog.optOut()
    }
  }

const userLoggedIn = (posthog: PosthogCrossPlatform, loginState: LoginState) => async (): Promise<void> => {
  logger.debug('lifecycle.userLoggedIn', 'loginState=%s', loginState)
  const consent = await consentStore.getConsent(loginState.isLoggedIn)
  // TODO this is called before login has been
  if (consent == ConsentState.Given) {
    logger.debug('lifecycle.userLoggedIn', 'consent given, opting in on posthog client')
    await posthog.optIn()
    if (loginState.isLoggedIn) {
      logger.debug('lifecycle.userLoggedIn', 'identifying user on posthog client')
      posthog.identify(loginState.userId)
    }
  } else {
    logger.debug('lifecycle.userLoggedIn', 'consent NOT given, opting out on posthog client')
    await posthog.optOut()
  }
}

const userLoggedOut = (posthog: PosthogCrossPlatform) => (): Promise<void> => {
  const errorContext = { location: 'useTracking.userLoggedOut' }
  return consentStore
    .clear()
    .then(() => logger.debug('lifecycle.userLoggedOut', 'cleared consentStore'))
    .catch((error) => logError(error, 'Failed to clear tracking consent', errorContext))
    .finally(() => posthog.reset())
    .then(() => logger.debug('lifecycle.userLoggedOut', 'posthog reset'))
    .catch((error) => logError(error, 'Failed to reset Posthog client', errorContext))
}

const userGaveTrackingConsent = (posthog: PosthogCrossPlatform, isLoggedIn: boolean) => (): void => {
  const errorContext = { location: 'useTracking.userGaveTrackingConsent' }
  consentStore
    .giveConsent(isLoggedIn)
    .then(() => logger.debug('lifecycle.userGaveTrackingConsent', 'persisted opt-in on consentStore'))
    .catch((error) => logError(error, 'Failed to store given tracking consent', errorContext))
    .then(() => posthog.optIn())
    .then(() => logger.debug('lifecycle.userGaveTrackingConsent', 'opted-in on Posthog client'))
    .catch((error) => logError(error, 'Failed to opt-in into tracking', errorContext))
}

const userDeniedTrackingConsent = (posthog: PosthogCrossPlatform, isLoggedIn: boolean) => (): void => {
  const errorContext = { location: 'useTracking.userDeniedTrackingRequest' }
  consentStore
    .denyConsent(isLoggedIn)
    .then(() => logger.debug('lifecycle.userDeniedTrackingConsent', 'persisted opt-out on consentStore'))
    .catch((error) => logError(error, 'Failed to store denied tracking consent', errorContext))
    .finally(() => posthog.optOut())
    .then(() => logger.debug('lifecycle.userDeniedTrackingConsent', 'opted-out on Posthog client'))
    .catch((error) => logError(error, 'Failed to opt-out from tracking', errorContext))
}

const useTracking = (): TrackingHook => {
  const posthog: PosthogCrossPlatform = usePosthogCrossPlatform()
  const loginState = useAuth()
  return {
    trackEvent: trackEvent(posthog),
    lifecycle: {
      appInit: appInit(posthog),
      userLoggedIn: userLoggedIn(posthog, loginState),
      userLoggedOut: userLoggedOut(posthog),
      userGaveTrackingConsent: userGaveTrackingConsent(posthog, loginState.isLoggedIn),
      userDeniedTrackingConsent: userDeniedTrackingConsent(posthog, loginState.isLoggedIn),
    },
  }
}

export default useTracking
