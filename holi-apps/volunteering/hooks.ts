import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagAB } from '@holi/core/featureFlags/hooks/useFeatureFlagAB'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'

export const useVolunteeringVariant = (): 'legacy' | 'maintenance' | 'recosV1' | 'off' => {
  const legacy = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING)
  const recosV1Toggle = useFeatureFlagToggle(FeatureFlagKey.VOLUNTEERING_RECOS_V1)
  const recosV1AB = useFeatureFlagAB(FeatureFlagKey.VOLUNTEERING_RECOS_V1_AB)

  const forLegacy = (): 'legacy' | 'off' | 'maintenance' => {
    if (legacy.isOn) return 'legacy'
    else if (legacy.isOff) return 'off'
    else if (legacy.inMaintenance) return 'maintenance'
    else return 'off'
  }

  if (legacy === undefined && recosV1Toggle === undefined && recosV1AB === undefined) return 'off'
  else if (legacy && recosV1Toggle === undefined && recosV1AB === undefined) {
    return forLegacy()
  } else if (legacy && recosV1Toggle !== undefined && recosV1AB === undefined) {
    if (recosV1Toggle) return 'recosV1'
    else return forLegacy()
  } else if (recosV1AB !== undefined) {
    if (recosV1AB === 'control') return forLegacy()
    else if (recosV1AB === 'test') return 'recosV1'
  }
  return 'off'
}
