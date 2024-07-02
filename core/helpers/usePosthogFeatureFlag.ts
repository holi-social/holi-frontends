import { useFeatureFlagWithPayload } from 'posthog-react-native'

import type { UsePosthogFeatureFlag } from '@holi/core/helpers/usePosthogFeatureFlag.common'

export const usePosthogFeatureFlag: UsePosthogFeatureFlag = (flag) => {
  return useFeatureFlagWithPayload(flag)
}
