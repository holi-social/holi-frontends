import { usePostHog } from 'posthog-js/react'

export const useFeatureFlagRefetch = () => {
  const posthog = usePostHog()

  const refetch = async () => posthog.featureFlags.reloadFeatureFlags()

  return refetch
}
