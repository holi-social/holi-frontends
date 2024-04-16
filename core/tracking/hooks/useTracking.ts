import { usePostHog } from 'posthog-react-native'

import { TrackingEvent } from '@holi/core/tracking/events'

import { TrackingHook } from './trackingHook'

const useTracking = (): TrackingHook => {
  const posthog = usePostHog()

  const trackEvent = (event: TrackingEvent) => {
    posthog.capture(event)
  }

  const optedIn = () => {
    return !posthog.optedOut
  }

  const optIn = async () => {
    await posthog.optIn()
  }

  const optOut = async () => {
    await posthog.optOut()
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
