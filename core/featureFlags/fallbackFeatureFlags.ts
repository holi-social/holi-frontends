import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { FeatureFlagsAndPayloads } from '@holi/core/featureFlags/types'

/**
 * These values are being used as fallback when bootstrapping feature flag values and payloads. When the application starts up, feature flags will
 * first be evaluated to bootstrapped values, while in the background they're being fetched from Posthog. Once available, app
 * components will re-render reactively in case a feature flag value has changed.
 */
export const fallbackFeatureFlags: FeatureFlagsAndPayloads = {
  featureFlags: {
    [FeatureFlagKey.DONATIONS]: 'on',
    [FeatureFlagKey.GOODNEWS]: 'on',
    [FeatureFlagKey.VOLUNTEERING]: 'on',
    [FeatureFlagKey.CHAT]: 'on',
    [FeatureFlagKey.NOTIFICATIONS]: 'on',
    [FeatureFlagKey.STORAGE]: 'on',
    [FeatureFlagKey.THEME_TOGGLE]: false, // not yet fully done
    [FeatureFlagKey.VIDEO_CALL]: 'on',
  },
  featureFlagPayloads: {
    [FeatureFlagKey.DONATIONS]: null,
    [FeatureFlagKey.GOODNEWS]: null,
    [FeatureFlagKey.VOLUNTEERING]: null,
    [FeatureFlagKey.CHAT]: null,
    [FeatureFlagKey.NOTIFICATIONS]: null,
    [FeatureFlagKey.STORAGE]: null,
    [FeatureFlagKey.THEME_TOGGLE]: null,
    [FeatureFlagKey.VIDEO_CALL]: null,
  },
}
