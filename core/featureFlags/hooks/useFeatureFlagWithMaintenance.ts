import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import type { FeatureFlagValue } from '@holi/core/featureFlags/types'

export const On = { isUnknown: false, isOn: true, isOff: false, inMaintenance: false }
export const Off = { isUnknown: false, isOn: false, isOff: true, inMaintenance: false }
export const Maintenance = { isUnknown: false, isOn: false, isOff: false, inMaintenance: true }
export const Unknown = { isUnknown: true, isOn: false, isOff: false, inMaintenance: false }

export type FeatureFlagWithMaintenance = typeof On | typeof Off | typeof Maintenance | typeof Unknown

export type UseFeatureFlagWithMaintenance = (flag: FeatureFlagKey) => FeatureFlagWithMaintenance

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FeatureFlagWithMaintenance {
  export const fromValue = (value: FeatureFlagValue): FeatureFlagWithMaintenance => {
    switch (value) {
      case 'on':
        return On
      case 'off':
        return Off
      case 'maintenance':
        return Maintenance
      case undefined:
        return Unknown
      default:
        // eslint-disable-next-line no-console
        console.warn(`Received unknown value "${value}" in FeatureFlagWithMaintenance.fromValue`)
        return Unknown
    }
  }
}

export const useFeatureFlagWithMaintenance: UseFeatureFlagWithMaintenance = (
  flag: FeatureFlagKey
): FeatureFlagWithMaintenance => {
  const value = useFeatureFlag(flag)
  return FeatureFlagWithMaintenance.fromValue((value && value[0]) || undefined)
}
