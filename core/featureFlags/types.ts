import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { JsonType as JsonTypeCore } from '@posthog/core'
import { JsonType as JsonTypeJs } from 'posthog-js'

export type FeatureFlagValue = string | boolean | undefined
export type FeatureFlagPayload = JsonTypeCore | JsonTypeJs | undefined

export interface FeatureFlagsAndPayloads {
  featureFlags: Record<FeatureFlagKey, string | boolean>
  featureFlagPayloads: Record<FeatureFlagKey, JsonTypeCore>
}
