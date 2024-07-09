import { useFeatureFlagWithPayload } from 'posthog-react-native'

import type { UseFeatureFlag } from '@holi/core/helpers/useFeatureFlag.common'

export const useFeatureFlag: UseFeatureFlag = (flag) => {
  return useFeatureFlagWithPayload(flag)
}
