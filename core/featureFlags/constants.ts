export enum FeatureFlagKey {
  DONATIONS = 'DONATIONS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  GOODNEWS = 'GOODNEWS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  VOLUNTEERING = 'VOLUNTEERING', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  EVENTS = 'EVENTS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  CHAT = 'CHAT', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  PETITIONS = 'PETITIONS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  START_SMALL_CAROUSEL = 'START_SMALL_CAROUSEL', // boolean
  NOTIFICATIONS = 'NOTIFICATIONS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  STORAGE = 'STORAGE', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  THEME_TOGGLE = 'THEME_TOGGLE', // boolean
  VIDEO_CALL = 'VIDEO_CALL', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  POST_TRANSLATION = 'POST_TRANSLATION', // boolean
  SOCIAL_LOGIN = 'social-login', // boolean
  REWARDS_PHASE_1 = 'rewards-phase-1', // boolean
  REWARDS_PHASE_2 = 'rewards-phase-2', // boolean
  FAVORITES_SLIDER = 'favorites-slider', // boolean
  BADGES = 'badges', // boolean
  GOOD_DEEDS_INTRO_PHASE_0 = 'good-deeds-intro-phase-0', // boolean
  GOOD_DEEDS_INTRO_PHASE_1__SIGN_UP = 'good-deeds-intro_phase_1--sign-up-process', // boolean
  GOOD_DEEDS_INTRO_PHASE_1__USER_TRACKED_FIRST_GOOD_DEED = 'good-deeds-intro_phase_1--user-tracked-first-good-deed', // boolean
  APPCUES_BANNER = 'appcues-banner', // boolean
  TASK_SELF_REPORTING_FLOW = 'self-reporting-flow-for-tasks', // boolean
}
