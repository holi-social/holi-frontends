import { useFeatureFlagPayload, useFeatureFlagVariantKey } from 'posthog-js/react'

import { isSSR } from '@holi/core/helpers/isSSR'
import {
  UseFeatureFlag,
  featureFlagBootstrapPayloads,
  featureFlagBootstrapValues,
} from '@holi/core/helpers/useFeatureFlag.common'

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
