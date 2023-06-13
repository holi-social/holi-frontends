import AsyncStore from '@react-native-async-storage/async-storage'

import type { ChatCredentials } from '@holi/chat/src/ChatClient'

import { CHAT_DEVICE_ID_KEY, CHAT_FRESH_LOGIN_KEY, CHAT_TOKEN_KEY, CHAT_URL, CHAT_USER_ID_KEY } from './constants'

export const getStoredSessionCreds = async (): Promise<ChatCredentials> => {
  const keys = [CHAT_TOKEN_KEY, CHAT_DEVICE_ID_KEY, CHAT_USER_ID_KEY, CHAT_FRESH_LOGIN_KEY]
  const values = await AsyncStore.multiGet(keys)

  const credentials: ChatCredentials = {
    baseUrl: CHAT_URL,
    guest: false,
    userId: '',
    accessToken: '',
  }

  // TODO: implement strategy for missing values
  return values.reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(key === CHAT_USER_ID_KEY ? { userId: value ?? '' } : {}),
      ...(key === CHAT_TOKEN_KEY ? { accessToken: value ?? '' } : {}),
      ...(key === CHAT_DEVICE_ID_KEY ? { deviceId: value ?? '' } : {}),
      ...(key === CHAT_FRESH_LOGIN_KEY ? { freshLogin: value === 'true' } : {}),
    }),
    credentials
  )
}
