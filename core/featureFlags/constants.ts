export enum FeatureFlagKey {
  DONATIONS = 'DONATIONS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  GOODNEWS = 'GOODNEWS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  VOLUNTEERING = 'VOLUNTEERING', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  CHAT = 'CHAT', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  NOTIFICATIONS = 'NOTIFICATIONS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  STORAGE = 'STORAGE', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  THEME_TOGGLE = 'THEME_TOGGLE', // boolean
  VIDEO_CALL = 'VIDEO_CALL', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  HOME_TASK_ORDER_SWAP = 'home-task-order-swap', // multivariate ('control', 'test') -> FeatureFlagAB
  FEEDBACK_LINK = 'feedback-link', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  POST_TRANSLATION = 'POST_TRANSLATION', // boolean
  NEW_HOME_FEED = 'NEW_HOME_FEED', // multivariate ('control', 'test') -> FeatureFlagAB
  TYPESENSE_SEARCH = 'typesense-search', // boolean
}
