import { usePostHog } from 'posthog-react-native'

import { TrackingEvent } from '@holi/core/tracking/events'

import { TrackingHook } from './trackingHook'

const useTracking = (): TrackingHook => {
  const posthog = usePostHog()

  const trackEvent = (event: TrackingEvent) => {
    posthog.capture(event)
  }

  return { trackEvent }
}

export default useTracking
