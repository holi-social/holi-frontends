import { usePostHog } from 'posthog-js/react'

import { TrackingEvent } from '@holi/core/tracking/events'

import { TrackingHook } from './trackingHook'

const useTracking = (): TrackingHook => {
  const posthog = usePostHog()

  const trackEvent = (event: TrackingEvent) => {
    posthog.capture(event)
  }

  const optedIn = () => {
    return posthog.has_opted_in_capturing()
  }

  const optIn = async () => {
    posthog.opt_in_capturing()
  }

  const optOut = async () => {
    posthog.opt_out_capturing()
  }

  const identify = (userId: string) => {
    posthog.identify(userId)
  }

  const reset = () => {
    posthog.reset()
  }

  return { trackEvent, optedIn, optIn, optOut, identify, reset }
}

export default useTracking
