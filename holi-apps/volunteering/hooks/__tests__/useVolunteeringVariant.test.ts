import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

import {
  LegacyValue,
  useVolunteeringDiscoveryVariant,
  useVolunteeringVariant,
} from '@holi-apps/volunteering/hooks/useVolunteeringVariant'

type VOLUNTEERING_VALUES_TYPES = 'on' | 'off' | 'maintenance' | undefined
type VOLUNTEERING_RECOS_V1_TYPES = boolean | undefined
type VOLUNTEERING_RECOS_V1_AB_TYPES = 'control' | 'test' | undefined

const createCases = <T extends string>(toggleVariant: T) =>
  [
    // feature flags have not loaded yet
    [undefined, undefined, undefined, 'off'],
    // only VOLUNTEERING flag exists (old clients)
    ['on', undefined, undefined, 'legacy'],
    ['off', undefined, undefined, 'off'],
    ['maintenance', undefined, undefined, 'maintenance'],
    // both VOLUNTEERING and VOLUNTEERING_RECOS_V1 exist
    ['on', true, undefined, toggleVariant],
    ['on', false, undefined, 'legacy'],
    ['off', true, undefined, toggleVariant],
    ['off', false, undefined, 'off'],
    ['maintenance', true, undefined, toggleVariant],
    ['maintenance', false, undefined, 'maintenance'],
    // all of VOLUNTEERING, VOLUNTEERING_RECOS_V1, VOLUNTEERING_RECOS_V1_AB exist
    // -> VOLUNTEERING_RECOS_V1_AB overrides every other feature flag value
    ['on', true, 'control', 'legacy'],
    ['on', true, 'test', toggleVariant],
    ['on', false, 'control', 'legacy'],
    ['on', false, 'test', toggleVariant],
    ['off', true, 'control', 'off'],
    ['off', false, 'test', toggleVariant],
    ['maintenance', true, 'control', 'maintenance'],
    ['maintenance', false, 'test', toggleVariant],
  ] as Array<[VOLUNTEERING_VALUES_TYPES, VOLUNTEERING_RECOS_V1_TYPES, VOLUNTEERING_RECOS_V1_AB_TYPES, LegacyValue | T]>

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))

describe('useVolunteeringVariant', () => {
  it.each(createCases('recosV1'))(
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

describe('useVolunteeringDiscoveryVariant', () => {
  it.each(createCases('discoveryV1'))(
    'useVolunteeringDiscoveryVariant(%s, %s, %s, %s)',
    (volunteeringValue, volunteeringDiscoveryV1Value, volunteeringRecosV1ABValue, expected) => {
      mockUseFeatureFlag.mockImplementation((key: FeatureFlagKey) => {
        if (key == FeatureFlagKey.VOLUNTEERING) return [volunteeringValue, undefined]
        else if (key == FeatureFlagKey.VOLUNTEERING_DISCOVERY_V1) return [volunteeringDiscoveryV1Value, undefined]
        else if (key === FeatureFlagKey.VOLUNTEERING_RECOS_V1_AB) return [volunteeringRecosV1ABValue, undefined]
        else return [undefined, undefined]
      })

      expect(useVolunteeringDiscoveryVariant()).toBe(expected)
    }
  )
})
