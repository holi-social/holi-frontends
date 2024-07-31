import { usePostHog } from 'posthog-react-native'

export const useFeatureFlagRefetch = () => {
  const posthog = usePostHog()

  const refetch = () => posthog.reloadFeatureFlagsAsync()

  return refetch
}
