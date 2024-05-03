import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import { trackingEnabled } from '@holi/core/tracking/config'
import { TrackingEvent } from '@holi/core/tracking/events'
import { TrackingHook } from '@holi/core/tracking/types'

const useDummyTracking = (): TrackingHook => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    trackEvent() {},
  }
}

const useRealTracking = (): TrackingHook => {
  const posthog = usePosthogCrossPlatform()
  return {
    trackEvent: (event: TrackingEvent) => {
      posthog.capture(event.name, event.properties)
    },
  }
}

const useTracking = trackingEnabled() ? useRealTracking : useDummyTracking

export default useTracking
