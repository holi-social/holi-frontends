export type JsonType = string | number | boolean | null | { [key: string]: JsonType } | Array<JsonType>

export type FeatureFlagValue = string | boolean | undefined
export type FeatureFlagPayload = JsonType | undefined
