import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey, FeatureFlagValue } from '@holi/core/featureFlags/hooks/useFeatureFlag.common'

export type On = { isUnknown: false; isOn: true; isOff: false; inMaintenance: false }
export type Off = { isUnknown: false; isOn: false; isOff: true; inMaintenance: false }
export type Maintenance = { isUnknown: false; isOn: false; isOff: false; inMaintenance: true }
export type Unknown = { isUnknown: true; isOn: false; isOff: false; inMaintenance: false }

export type FeatureFlagWithMaintenance = On | Off | Maintenance | Unknown

export type UseFeatureFlagWithMaintenance = (flag: FeatureFlagKey) => FeatureFlagWithMaintenance

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FeatureFlagWithMaintenance {
  const UNKNOWN: Unknown = { isUnknown: true, isOn: false, isOff: false, inMaintenance: false }

  export const fromValue = (value: FeatureFlagValue): FeatureFlagWithMaintenance => {
    switch (value) {
      case 'on':
        return { isUnknown: false, isOn: true, isOff: false, inMaintenance: false }
      case 'off':
        return { isUnknown: false, isOn: false, isOff: true, inMaintenance: false }
      case 'maintenance':
        return { isUnknown: false, isOn: false, isOff: false, inMaintenance: true }
      case undefined:
        return UNKNOWN
      default:
        // eslint-disable-next-line no-console
        console.warn(`Received unknown value "${value}" in FeatureFlagWithMaintenance.fromValue`)
        return UNKNOWN
    }
  }
}

export const useFeatureFlagWithMaintenance: UseFeatureFlagWithMaintenance = (
  flag: FeatureFlagKey
): FeatureFlagWithMaintenance => {
  const value = useFeatureFlag(flag)
  return FeatureFlagWithMaintenance.fromValue((value && value[0]) || undefined)
}
