import { useFeatureFlagPayload, useFeatureFlagVariantKey } from 'posthog-js/react'

import { featureFlagBootstrapPayloads, featureFlagBootstrapValues } from '@holi/core/featureFlags/constants'
import type { UseFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag.common'
import { isSSR } from '@holi/core/helpers/isSSR'

export const useFeatureFlag: UseFeatureFlag = (flag) => {
  const state = useFeatureFlagVariantKey(flag)
  const payload = useFeatureFlagPayload(flag)

  // Use bootstrapped values as fallback and during SSR
  const fallbackState = featureFlagBootstrapValues[flag]
  const fallbackPayload = featureFlagBootstrapPayloads[flag]

  if (isSSR) {
    return [fallbackState, fallbackPayload]
  }

  return [state || fallbackState, payload || fallbackPayload]
}
