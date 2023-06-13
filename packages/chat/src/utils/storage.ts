import AsyncStore from '@react-native-async-storage/async-storage'

import { MxClientCredentials } from '@holi/chat/src/MxClient'

import {
  CHAT_FRESH_LOGIN_KEY,
  HOMESERVER_DEVICE_ID_KEY,
  HOMESERVER_TOKEN_KEY,
  HOMESERVER_URL,
  HOMESERVER_USER_ID_KEY,
} from './constants'

export const getStoredSessionCreds = async (): Promise<MxClientCredentials> => {
  const keys = [HOMESERVER_TOKEN_KEY, HOMESERVER_DEVICE_ID_KEY, HOMESERVER_USER_ID_KEY, CHAT_FRESH_LOGIN_KEY]
  const values = await AsyncStore.multiGet(keys)

  const credentials = {
    baseUrl: HOMESERVER_URL,
    guest: false,
  } as MxClientCredentials

  // TODO: implement strategy for missing values
  return values.reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(key === HOMESERVER_USER_ID_KEY ? { userId: value ?? '' } : {}),
      ...(key === HOMESERVER_TOKEN_KEY ? { accessToken: value ?? '' } : {}),
      ...(key === HOMESERVER_DEVICE_ID_KEY ? { deviceId: value ?? '' } : {}),
      ...(key === CHAT_FRESH_LOGIN_KEY ? { freshLogin: value === 'true' } : {}),
    }),
    credentials
  )
}
