import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { FeatureFlagsAndPayloads } from '@holi/core/featureFlags/types'

/**
 * These values are being used when bootstrapping feature flag values and payloads. When the application starts up,
 * feature flags will first be evaluated to bootstrapped values, while in the background they're being fetched from
 * Posthog. Once available, app components will re-render reactively in case a feature flag value has changed.
 *
 * Bootstrap values can come into the PostHog client in three different ways:
 *
 * 1. Mobile - bootstrap values are taken from these constants here
 * 2. Web (SSR) - actual feature flag values are being requested from PostHog, used on server-side page rendering,
 *                included in page props and the used in bootstrapping the PostHog client in the Browser
 * 3. Web (CSR) - bootstrap values are taken from these constants here (if not present in page props from SSR rendering)
 */
export const featureFlagBootstrapValues: FeatureFlagsAndPayloads = {
  featureFlags: {
    [FeatureFlagKey.DONATIONS]: 'on',
    [FeatureFlagKey.GOODNEWS]: 'on',
    [FeatureFlagKey.VOLUNTEERING]: 'on',
    [FeatureFlagKey.CHAT]: 'on',
    [FeatureFlagKey.NOTIFICATIONS]: 'on',
    [FeatureFlagKey.STORAGE]: 'on',
    [FeatureFlagKey.THEME_TOGGLE]: false, // not yet fully done
    [FeatureFlagKey.VIDEO_CALL]: 'on',
    [FeatureFlagKey.HOME_TASK_ORDER_SWAP]: 'control',
    [FeatureFlagKey.TYPESENSE_SEARCH]: false,
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
    [FeatureFlagKey.HOME_TASK_ORDER_SWAP]: null,
    [FeatureFlagKey.TYPESENSE_SEARCH]: null,
  },
}
