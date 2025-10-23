import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import type { FeatureFlagsAndPayloads } from '@holi/core/featureFlags/types'

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
    [FeatureFlagKey.POST_TRANSLATION]: false,
    [FeatureFlagKey.TASK_CONTACT_CTA]: false,
    [FeatureFlagKey.EVENTS]: false,
    [FeatureFlagKey.SOCIAL_LOGIN]: true,
    [FeatureFlagKey.PETITIONS]: true,
    [FeatureFlagKey.START_SMALL_CAROUSEL]: true,
    [FeatureFlagKey.REWARDS_PHASE_1]: false,
    [FeatureFlagKey.REWARDS_PHASE_2]: false,
    [FeatureFlagKey.FAVORITES_SLIDER]: false,
    [FeatureFlagKey.BADGES]: false,
    [FeatureFlagKey.GOOD_DEEDS_INTRO_PHASE_0]: false,
    [FeatureFlagKey.GOOD_DEEDS_INTRO_PHASE_1__SIGN_UP]: false,
    [FeatureFlagKey.GOOD_DEEDS_INTRO_PHASE_1__USER_TRACKED_FIRST_GOOD_DEED]: false,
    [FeatureFlagKey.GOOD_DEEDS_INTRO_PHASE_1__USER_FAVORITED_FIRST_GOOD_DEED]: false,
    [FeatureFlagKey.APPCUES_BANNER]: false,
    [FeatureFlagKey.TASK_SELF_REPORTING_FLOW]: false,
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
    [FeatureFlagKey.POST_TRANSLATION]: null,
    [FeatureFlagKey.TASK_CONTACT_CTA]: null,
    [FeatureFlagKey.EVENTS]: null,
    [FeatureFlagKey.SOCIAL_LOGIN]: null,
    [FeatureFlagKey.PETITIONS]: null,
    [FeatureFlagKey.START_SMALL_CAROUSEL]: null,
    [FeatureFlagKey.REWARDS_PHASE_1]: null,
    [FeatureFlagKey.REWARDS_PHASE_2]: null,
    [FeatureFlagKey.FAVORITES_SLIDER]: null,
    [FeatureFlagKey.BADGES]: null,
    [FeatureFlagKey.GOOD_DEEDS_INTRO_PHASE_0]: null,
    [FeatureFlagKey.GOOD_DEEDS_INTRO_PHASE_1__SIGN_UP]: null,
    [FeatureFlagKey.GOOD_DEEDS_INTRO_PHASE_1__USER_TRACKED_FIRST_GOOD_DEED]: null,
    [FeatureFlagKey.GOOD_DEEDS_INTRO_PHASE_1__USER_FAVORITED_FIRST_GOOD_DEED]: null,
    [FeatureFlagKey.APPCUES_BANNER]: null,
    [FeatureFlagKey.TASK_SELF_REPORTING_FLOW]: null,
  },
}

Object.values(FeatureFlagKey).forEach((key) => {
  if (!(key in featureFlagBootstrapValues.featureFlags)) {
    throw new Error(
      `Missing feature flag entry for flag '${key}'. This is needed for rendering while feature flags are still loading from remote.`
    )
  }
  if (!(key in featureFlagBootstrapValues.featureFlagPayloads)) {
    throw new Error(
      `Missing feature flag payload entry for flag '${key}'. This is needed for rendering while feature flags are still loading from remote.`
    )
  }
})
