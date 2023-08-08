import type { Platform } from 'react-native'

export type ServerName = `${'staging' | 'local'}.chat.holi.social`
export type UserName = `@${string}:${ServerName}`
export type MatrixDeviceName = `holi-${Platform['OS']}`

// TODO remove from chat storage
export const CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN = 'mx_client_login' // matrix client can use refresh token to retrieve new access token, only need to partially sync state

// TODO comment out from chat storage
// stored for quicker login (no need to fetch /api/chatlogin first)
export const CHAT_LOCAL_STORAGE_KEY_USER_ID = 'mx_user_id'

// TODO comment out from chat storage
// stored for quicker login (no need to fetch /api/chatlogin first)
export const CHAT_LOCAL_STORAGE_KEY_TOKEN = 'mx_sso_token'

// TODO comment out from chat storage
// stored for quicker login (no need to fetch /api/chatlogin first)
export const CHAT_LOCAL_STORAGE_KEY_DEVICE_ID = 'mx_device'
