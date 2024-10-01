import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

const mockUseFeatureFlag = jest.fn()

export const mockFeatureFlags = (o: Partial<Record<FeatureFlagKey, string>>) => {
  mockUseFeatureFlag.mockImplementation((flag: FeatureFlagKey) => {
    return [o[flag], undefined]
  })
}

jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))
