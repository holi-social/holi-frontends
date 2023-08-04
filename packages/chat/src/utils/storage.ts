import AsyncStore from '@react-native-async-storage/async-storage'

import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { chatUrl } from '@holi/core/helpers/config'

import {
  CHAT_LOCAL_STORAGE_KEY_DEVICE_ID,
  CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN,
  CHAT_LOCAL_STORAGE_KEY_TOKEN,
  CHAT_LOCAL_STORAGE_KEY_USER_ID,
} from './constants'

export const getStoredSessionCreds = async (): Promise<ChatCredentials> => {
  const values = await AsyncStore.multiGet([
    CHAT_LOCAL_STORAGE_KEY_TOKEN,
    CHAT_LOCAL_STORAGE_KEY_DEVICE_ID,
    CHAT_LOCAL_STORAGE_KEY_USER_ID,
    CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN,
  ])

  const credentials: ChatCredentials = {
    baseUrl: chatUrl,
    guest: false,
    userId: '',
    accessToken: '',
  }

  // TODO: implement strategy for missing values
  return values.reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(key === CHAT_LOCAL_STORAGE_KEY_USER_ID ? { userId: value ?? '' } : {}),
      ...(key === CHAT_LOCAL_STORAGE_KEY_TOKEN ? { accessToken: value ?? '' } : {}),
      ...(key === CHAT_LOCAL_STORAGE_KEY_DEVICE_ID ? { deviceId: value ?? '' } : {}),
      ...(key === CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN ? { freshLogin: value === 'true' } : {}),
    }),
    credentials
  )
}
