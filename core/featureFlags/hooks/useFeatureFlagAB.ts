import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'

export const useFeatureFlagAB = (key: FeatureFlagKey): 'control' | 'test' | undefined => {
  const [value] = useFeatureFlag(key)
  if (value == 'control' || value == 'test') return value
  else if (value === undefined) return undefined
  else {
    // eslint-disable-next-line no-console
    console.warn(`Received unexpected value ${value} in useFeatureFlagAB for key=${key}`)
    return undefined
  }
}
