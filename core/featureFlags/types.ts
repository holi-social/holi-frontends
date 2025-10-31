import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { type JsonType } from '@posthog/core'

export type FeatureFlagValue = string | boolean | undefined
export type FeatureFlagPayload = JsonType | undefined

export interface FeatureFlagsAndPayloads {
  featureFlags: Record<FeatureFlagKey, string | boolean>
  featureFlagPayloads: Record<FeatureFlagKey, JsonType>
}
