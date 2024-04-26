import { TrackingEvent } from '@holi/core/tracking/events'
import { usePosthogCrossPlatform } from '@holi/core/tracking/posthog_cross_platform'
import { TrackingHook } from '@holi/core/tracking/types'

const useTracking = (): TrackingHook => {
  const posthog = usePosthogCrossPlatform()
  return {
    trackEvent: (event: TrackingEvent) => {
      posthog.capture(event.name, event.properties)
    },
  }
}

export default useTracking
