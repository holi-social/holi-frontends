import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

export type JsonType = string | number | boolean | null | { [key: string]: JsonType } | Array<JsonType>

export type FeatureFlagValue = string | boolean | undefined
export type FeatureFlagPayload = JsonType | undefined

export interface FeatureFlagsAndPayloads {
  featureFlags: Record<FeatureFlagKey, string | boolean>
  featureFlagPayloads: Record<FeatureFlagKey, JsonType>
}
