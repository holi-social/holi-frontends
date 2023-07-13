import Constants from 'expo-constants'
import type { Platform } from 'react-native'

export type ServerName = `${'staging' | 'local'}.chat.holi.social`
export type UserName = `@${string}:${ServerName}`
export type MatrixUserKey = 'mx_user_id'

export type MatrixDeviceName = `holi-${Platform['OS']}`
export type ServerTokenKey = 'mx_sso_token'
export type MatrixLoginKey = 'mx_client_login'
export type MatrixDeviceIdKey = 'mx_device'

export const CHAT_FRESH_LOGIN_KEY = 'mx_client_login'
export const CHAT_USER_ID_KEY: MatrixUserKey = 'mx_user_id'
export const CHAT_TOKEN_KEY = 'mx_sso_token'
export const CHAT_DEVICE_ID_KEY: MatrixDeviceIdKey = 'mx_device'
export const CHAT_LOGIN_URL = Constants.manifest?.extra?.chat.serverLoginUrl || '/api/chatlogin'
export const CHAT_URL = Constants.manifest?.extra?.chat.serverUrl || 'https://staging.chat.holi.social/'
export const CHAT_SELECTED_ROOM_ID_KEY = 'mx_selected_room_id'
