import type { Platform } from 'react-native'

export type ServerName = `${'staging' | 'local'}.chat.holi.social`
export type UserName = `@${string}:${ServerName}`
export type MatrixDeviceName = `holi-${Platform['OS']}`

export const CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN = 'mx_client_login'
export const CHAT_LOCAL_STORAGE_KEY_USER_ID = 'mx_user_id'
export const CHAT_LOCAL_STORAGE_KEY_TOKEN = 'mx_sso_token'
export const CHAT_LOCAL_STORAGE_KEY_DEVICE_ID = 'mx_device'
export const CHAT_LOCAL_STORAGE_KEY_SELECTED_ROOM_ID = 'mx_selected_room_id'
