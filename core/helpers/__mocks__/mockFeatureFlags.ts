import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

/** You can import this file and simply call the mockFeatureFlag function, to mock the feature flags in the way you want them.
 * e.g. mockFeatureFlags({
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
