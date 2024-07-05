export enum FeatureFlagKey {
  THEME_TOGGLE = 'THEME_TOGGLE',
}

export const featureFlagBootstrapValues: Record<FeatureFlagKey, string | boolean> = {
  [FeatureFlagKey.THEME_TOGGLE]: false,
}

export type JsonType = string | number | boolean | null | { [key: string]: JsonType } | Array<JsonType>

export type FeatureFlagValue = string | boolean | undefined
export type FeatureFlagPayload = JsonType | undefined

export type UsePosthogFeatureFlag = (flag: FeatureFlagKey) => [FeatureFlagValue, FeatureFlagPayload]
