import { useFeatureFlagPayload, useFeatureFlagVariantKey, usePostHog } from 'posthog-js/react'

import { JsonType } from 'posthog-js'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import type { FeatureFlagValue } from '@holi/core/featureFlags/types'

export const useFeatureFlag: (flag: FeatureFlagKey) => [FeatureFlagValue, JsonType] = (flag) => {
  const posthog = usePostHog()
  // These hooks get updated on feature flag values changes
  const state = useFeatureFlagVariantKey(flag)
  const payload = useFeatureFlagPayload(flag)

  // Use bootstrapped values as initial fallback
  const fallbackState = posthog.featureFlags.getFeatureFlag(flag)
  const fallbackPayload = posthog.featureFlags.getFeatureFlagPayload(flag)

  return [state || fallbackState, payload || fallbackPayload]
}
