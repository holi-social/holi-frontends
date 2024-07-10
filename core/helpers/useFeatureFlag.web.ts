import { useFeatureFlagPayload, useFeatureFlagVariantKey } from 'posthog-js/react'

import type { UseFeatureFlag } from '@holi/core/helpers/useFeatureFlag.common'

export const useFeatureFlag: UseFeatureFlag = (flag) => {
  const state = useFeatureFlagVariantKey(flag)
  const payload = useFeatureFlagPayload(flag)

  return [state, payload]
}
