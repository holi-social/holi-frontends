import { usePostHog } from 'posthog-js/react'

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
