import { useFeatureFlagPayload, useFeatureFlagVariantKey } from 'posthog-js/react'

import type { UsePosthogFeatureFlag } from '@holi/core/helpers/usePosthogFeatureFlag.common'

export const usePosthogFeatureFlag: UsePosthogFeatureFlag = (flag) => {
  const state = useFeatureFlagVariantKey(flag)
  const payload = useFeatureFlagPayload(flag)

  return [state, payload]
}
