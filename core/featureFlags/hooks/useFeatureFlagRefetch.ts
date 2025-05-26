import { usePostHog } from 'posthog-react-native'

export const useFeatureFlagRefetch = () => {
  const posthog = usePostHog()

  const refetch = () => {
    posthog.identify()
    return posthog.reloadFeatureFlagsAsync()
  }

  return refetch
}
