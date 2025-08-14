import { useFeatureFlagPayload, useFeatureFlagVariantKey, usePostHog } from 'posthog-js/react'

import type { UseFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag.common'
import type { FeatureFlagPayload } from '@holi/core/featureFlags/types'

export const useFeatureFlag: UseFeatureFlag = (flag) => {
  const posthog = usePostHog()
  // These hooks get updated on feature flag values changes
  const state = useFeatureFlagVariantKey(flag)
  const payload = useFeatureFlagPayload(flag)

  // Use bootstrapped values as initial fallback
  const fallbackState = posthog.featureFlags.getFeatureFlag(flag)
  const fallbackPayload = posthog.featureFlags.getFeatureFlagPayload(flag)

  return [state || fallbackState, (payload || fallbackPayload) as FeatureFlagPayload]
}
