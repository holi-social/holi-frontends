import AsyncStore from '@react-native-async-storage/async-storage'

import { logError } from '@holi/core/errors/helpers'

import {
  CHAT_LOCAL_STORAGE_KEY_DEVICE_ID,
  CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN,
  CHAT_LOCAL_STORAGE_KEY_TOKEN,
  CHAT_LOCAL_STORAGE_KEY_USER_ID,
} from './constants'

export interface StoredCredentials {
  access_token: string
  device_id: string
  user_id: string
  fresh_login: boolean
}

export const loadSessionCredentials = async (): Promise<StoredCredentials | undefined> => {
  const values = await AsyncStore.multiGet([
    CHAT_LOCAL_STORAGE_KEY_TOKEN,
    CHAT_LOCAL_STORAGE_KEY_DEVICE_ID,
    CHAT_LOCAL_STORAGE_KEY_USER_ID,
    CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN,
  ])

  // TODO: implement strategy for missing values
  const storedSessionCredentials = values.reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(key === CHAT_LOCAL_STORAGE_KEY_TOKEN ? { access_token: value ?? '' } : {}),
      ...(key === CHAT_LOCAL_STORAGE_KEY_DEVICE_ID ? { device_id: value ?? '' } : {}),
      ...(key === CHAT_LOCAL_STORAGE_KEY_USER_ID ? { user_id: value ?? '' } : {}),
      ...(key === CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN ? { fresh_login: value === 'true' } : {}),
    }),
    {}
  ) as StoredCredentials
  if (
    !storedSessionCredentials.access_token ||
    !storedSessionCredentials.device_id ||
    !storedSessionCredentials.user_id
  ) {
    return undefined
  }
  return storedSessionCredentials
}

export const storeSessionCredentials = async (credentials: StoredCredentials): Promise<StoredCredentials> => {
  await clearSessionCredentials()

  // Reset newly received credentials
  const multiSetCreds: [string, string][] = [
    // TODO: the `access_token` should be stored with some kind of encryption
    [CHAT_LOCAL_STORAGE_KEY_TOKEN, credentials.access_token],
    [CHAT_LOCAL_STORAGE_KEY_DEVICE_ID, credentials.device_id],
    [CHAT_LOCAL_STORAGE_KEY_USER_ID, credentials.user_id],
    [CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN, `${credentials.fresh_login}`],
  ]

  await AsyncStore.multiSet(multiSetCreds).catch((err) =>
    logError(err, 'Could not store session credentials', { location: 'storage.storeSessionCredentials' })
  )
  return credentials
}

/**
 * Removes all the stored chat client credentials.
 */
export const clearSessionCredentials = async (): Promise<void> => {
  await AsyncStore.multiRemove([
    CHAT_LOCAL_STORAGE_KEY_TOKEN,
    CHAT_LOCAL_STORAGE_KEY_DEVICE_ID,
    CHAT_LOCAL_STORAGE_KEY_USER_ID,
    CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN,
  ])
}
