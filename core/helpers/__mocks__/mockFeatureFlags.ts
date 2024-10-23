import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

/**
 * To use this, you need to call mockFeatureFlags and pass in the FeatureFlags and their values like this:
 *     mockFeatureFlags({
 *       [FeatureFlagKey.DONATIONS]: 'on',
 *       [FeatureFlagKey.VOLUNTEERING]: 'off',
 *     })
 */
const mockUseFeatureFlag = jest.fn()

export const mockFeatureFlags = (o: Partial<Record<FeatureFlagKey, string>>) => {
  mockUseFeatureFlag.mockImplementation((flag: FeatureFlagKey) => {
    return [o[flag], undefined]
  })
}

jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))
