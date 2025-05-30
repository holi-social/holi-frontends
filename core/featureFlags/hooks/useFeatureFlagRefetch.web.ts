import { usePostHog } from 'posthog-js/react'

export const useFeatureFlagRefetch = () => {
  const posthog = usePostHog()

  const refetch = async () => {
    posthog.identify()
    return posthog.featureFlags.reloadFeatureFlags()
  }

  return refetch
}
