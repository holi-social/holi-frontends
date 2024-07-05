import { getLogger } from '@holi/core/helpers/logging'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { trackingEnabled } from '@holi/core/tracking/config'
import { TrackingEvent } from '@holi/core/tracking/events'
import { ConsentState, TrackingHook } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

const useDummyTracking = (): TrackingHook => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    track() {},
  }
}

const useRealTracking = (): TrackingHook => {
  const posthog = usePosthogCrossPlatform()
  const consent = useConsentState()
  return {
    track: (event: TrackingEvent) => {
      logger.debug('trackEvent', 'tracking event', event)
      try {
        posthog.capture(event.name, {
          ...event.properties,
          ...ConsentState.toEventProperties(consent),
          version: event.version,
        })
      } catch (e) {
        // console.error will be picked up by Sentry, so this does not go unnoticed to the programmer, but to the user.
        // eslint-disable-next-line no-console
        console.error('Error during evaluation of onTrack callback', e)
      }
    },
  }
}

const useTracking = trackingEnabled() ? useRealTracking : useDummyTracking

export default useTracking
