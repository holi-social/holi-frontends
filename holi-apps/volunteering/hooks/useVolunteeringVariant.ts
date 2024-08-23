import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagAB } from '@holi/core/featureFlags/hooks/useFeatureFlagAB'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import {
  FeatureFlagWithMaintenance,
  useFeatureFlagWithMaintenance,
} from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'

export type LegacyValue = 'legacy' | 'maintenance' | 'off'

const getLegacyValue = (legacy: FeatureFlagWithMaintenance): LegacyValue => {
  if (legacy.isOn) return 'legacy'
  else if (legacy.isOff) return 'off'
  else if (legacy.inMaintenance) return 'maintenance'
  else return 'off'
}

const useVolunteeringVariantForToggle = <T extends string>(
  toggleVariant: T,
  toggle: boolean | undefined
): LegacyValue | T => {
  const legacy = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING)
  const recosV1AB = useFeatureFlagAB(FeatureFlagKey.VOLUNTEERING_RECOS_V1_AB)
  const legacyValue = getLegacyValue(legacy)

  if (legacy === undefined && toggle === undefined && recosV1AB === undefined) return 'off'
  else if (legacy && toggle === undefined && recosV1AB === undefined) {
    return legacyValue
  } else if (legacy && toggle !== undefined && recosV1AB === undefined) {
    if (toggle) return toggleVariant
    else return legacyValue
  } else if (recosV1AB !== undefined) {
    if (recosV1AB === 'control') return legacyValue
    else if (recosV1AB === 'test') return toggleVariant
  }
  return 'off'
}
export const useVolunteeringVariant = (): LegacyValue | 'recosV1' => {
  const recosV1Toggle = useFeatureFlagToggle(FeatureFlagKey.VOLUNTEERING_RECOS_V1)
  return useVolunteeringVariantForToggle('recosV1', recosV1Toggle)
}

export const useVolunteeringDiscoveryVariant = (): LegacyValue | 'discoveryV1' => {
  const discoveryV1Toggle = useFeatureFlagToggle(FeatureFlagKey.VOLUNTEERING_DISCOVERY_V1)
  return useVolunteeringVariantForToggle('discoveryV1', discoveryV1Toggle)
}
