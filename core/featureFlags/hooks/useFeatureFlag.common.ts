export enum FeatureFlagKey {
  DONATIONS = 'DONATIONS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  GOODNEWS = 'GOODNEWS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  VOLUNTEERING = 'VOLUNTEERING', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  CHAT = 'CHAT', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  NOTIFICATIONS = 'NOTIFICATIONS', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  STORAGE = 'STORAGE', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
  THEME_TOGGLE = 'THEME_TOGGLE', // boolean
  VIDEO_CALL = 'VIDEO_CALL', // multivariate ('on', 'off', 'maintenance') -> FeatureFlagWithMaintenance
}

/**
 * These values are being used to bootstrap feature flag values. When the application starts up, feature flags will
 * first be evaluated to these values, while in the background they're being fetched from Posthog. Once available, app
 * components will re-render reactively in case a feature flag value has changed.
 */
export const featureFlagBootstrapValues: Record<FeatureFlagKey, string | boolean> = {
  [FeatureFlagKey.DONATIONS]: 'on',
  [FeatureFlagKey.GOODNEWS]: 'on',
  [FeatureFlagKey.VOLUNTEERING]: 'on',
  [FeatureFlagKey.CHAT]: 'on',
  [FeatureFlagKey.NOTIFICATIONS]: 'on',
  [FeatureFlagKey.STORAGE]: 'on',
  [FeatureFlagKey.THEME_TOGGLE]: false, // not yet fully done
  [FeatureFlagKey.VIDEO_CALL]: 'on',
}

export const featureFlagBootstrapPayloads: Record<FeatureFlagKey, JsonType> = {
  [FeatureFlagKey.DONATIONS]: null,
  [FeatureFlagKey.GOODNEWS]: null,
  [FeatureFlagKey.VOLUNTEERING]: null,
  [FeatureFlagKey.CHAT]: null,
  [FeatureFlagKey.NOTIFICATIONS]: null,
  [FeatureFlagKey.STORAGE]: null,
  [FeatureFlagKey.THEME_TOGGLE]: null,
  [FeatureFlagKey.VIDEO_CALL]: null,
}

export type JsonType = string | number | boolean | null | { [key: string]: JsonType } | Array<JsonType>

export type FeatureFlagValue = string | boolean | undefined
export type FeatureFlagPayload = JsonType | undefined

export type UseFeatureFlag = (flag: FeatureFlagKey) => [FeatureFlagValue, FeatureFlagPayload]
