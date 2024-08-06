import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import type { FeatureFlagPayload, FeatureFlagValue } from '@holi/core/featureFlags/types'

export type UseFeatureFlag = (flag: FeatureFlagKey) => [FeatureFlagValue, FeatureFlagPayload]
