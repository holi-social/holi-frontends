import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagValue } from '@holi/core/featureFlags/types'

export const useFeatureFlagToggle = (flag: FeatureFlagKey): boolean | undefined => {
  const [value] = useFeatureFlag(flag)
  if (typeof value === 'boolean') return value
  else if (isBooleanString(value)) return JSON.parse(value) as boolean
  else if (value === undefined) return undefined
  else {
    // eslint-disable-next-line no-console
    console.warn(`Received unexpected value "${value}" in useFeatureFlagToggle`)
    return false
  }
}

function isBooleanString(str: FeatureFlagValue): str is 'true' | 'false' {
  return str === 'true' || str === 'false'
}
