import { usePostHog } from 'posthog-js/react'

const useTracking = () => {
  const posthog = usePostHog()

  const capture = (eventName: string, eventProperties?: object) => {
    posthog.capture(eventName, eventProperties)
  }

  return { capture }
}

export default useTracking
