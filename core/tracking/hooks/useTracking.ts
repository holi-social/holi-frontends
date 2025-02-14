import { getLogger } from '@holi/core/helpers/logging'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { TrackingEvent } from '@holi/core/tracking/events'
import { ConsentState, TrackingHook } from '@holi/core/tracking/types'
import { useCallback } from 'react'

const logger = getLogger('Tracking')

const useTracking = (): TrackingHook => {
  const posthog = usePosthogCrossPlatform()
  const [consent] = useConsentState()
  return {
    track: useCallback(
      (event: TrackingEvent) => {
        logger.debug('trackEvent', `tracking "${event.name}" event`, event)
        try {
          posthog.capture(event.name, {
            ...event.properties,
            ...ConsentState.toEventProperties(consent),
            event_version__major: event.event_version__major,
            event_version__minor: event.event_version__minor,
            event_version__patch: event.event_version__patch,
          })
        } catch (e) {
          // console.error will be picked up by Sentry, so this does not go unnoticed to the programmer, but to the user.
          // eslint-disable-next-line no-console
          console.error('Error during evaluation of onTrack callback', e)
        }
      },
      [consent, posthog]
    ),
  }
}

export default useTracking
