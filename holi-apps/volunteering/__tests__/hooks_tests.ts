import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks'

type VOLUNTEERING_VALUES_TYPES = 'on' | 'off' | 'maintenance' | undefined
type VOLUNTEERING_RECOS_V1_TYPES = boolean | undefined
type VOLUNTEERING_RECOS_V1_AB_TYPES = 'control' | 'test' | undefined

type HOOK_TYPES = 'legacy' | 'recosV1' | 'maintenance' | 'off'

const cases = [
  // feature flags have not loaded yet
  [undefined, undefined, undefined, 'off'],
  // only VOLUNTEERING flag exists (old clients)
  ['on', undefined, undefined, 'legacy'],
  ['off', undefined, undefined, 'off'],
  ['maintenance', undefined, undefined, 'maintenance'],
  // both VOLUNTEERING and VOLUNTEERING_RECOS_V1 exist
  ['on', true, undefined, 'recosV1'],
  ['on', false, undefined, 'legacy'],
  ['off', true, undefined, 'recosV1'],
  ['off', false, undefined, 'off'],
  ['maintenance', true, undefined, 'recosV1'],
  ['maintenance', false, undefined, 'maintenance'],
  // all of VOLUNTEERING, VOLUNTEERING_RECOS_V1, VOLUNTEERING_RECOS_V1_AB exist
  // -> VOLUNTEERING_RECOS_V1_AB overrides every other feature flag value
  ['on', true, 'control', 'legacy'],
  ['on', true, 'test', 'recosV1'],
  ['on', false, 'control', 'legacy'],
  ['on', false, 'test', 'recosV1'],
  ['off', true, 'control', 'off'],
  ['off', false, 'test', 'recosV1'],
  ['maintenance', true, 'control', 'maintenance'],
  ['maintenance', false, 'test', 'recosV1'],
] as Array<[VOLUNTEERING_VALUES_TYPES, VOLUNTEERING_RECOS_V1_TYPES, VOLUNTEERING_RECOS_V1_AB_TYPES, HOOK_TYPES]>

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))

describe('useVolunteeringVariant', () => {
  it.each(cases)(
    'useVolunteeringVariant(%s, %s, %s, %s)',
    (volunteeringValue, volunteeringRecosV1Value, volunteeringRecosV1ABValue, expected) => {
      mockUseFeatureFlag.mockImplementation((key: FeatureFlagKey) => {
        if (key == FeatureFlagKey.VOLUNTEERING) return [volunteeringValue, undefined]
        else if (key == FeatureFlagKey.VOLUNTEERING_RECOS_V1) return [volunteeringRecosV1Value, undefined]
        else if (key === FeatureFlagKey.VOLUNTEERING_RECOS_V1_AB) return [volunteeringRecosV1ABValue, undefined]
        else return [undefined, undefined]
      })

      expect(useVolunteeringVariant()).toBe(expected)
    }
  )
})
