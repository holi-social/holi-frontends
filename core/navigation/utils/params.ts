import type { QueryParams } from 'expo-linking'

export const hasQueryParam = (params: QueryParams | null, key: string): params is QueryParams => {
  return params !== null && Boolean(params[key])
}
