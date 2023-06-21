import Constants from 'expo-constants'
import type { Platform } from 'react-native'

export type ServerName = 'local.chat.holi.social'
export type UserName = `@${string}:${ServerName}`
export type MatrixUserKey = 'mx_user_id'

export type MatrixDeviceName = `holi-${Platform['OS']}`
export type ServerNameKey = 'mx_sso_hs_url'
export type ServerTokenKey = 'mx_sso_token'
export type MatrixLoginKey = 'mx_client_login'
export type MatrixDeviceIdKey = 'mx_device'
export type CurrentRoomKey = 'mx_current_room'

// TODO: remove fallbacks
export const CHAT_TOKEN_KEY = Constants.manifest?.extra?.chat.homeserverToken || 'mx_sso_token'
export const CHAT_URL_KEY = Constants.manifest?.extra?.chat.homeserverUrlKey || 'mx_sso_hs_url'
export const CHAT_URL = Constants.manifest?.extra?.chat.homeserverUrl || 'https://local.chat.holi.social'
export const CHAT_NAME = Constants.manifest?.extra?.chat.homeserverName || 'local.chat.holi.social'
export const CHAT_FRESH_LOGIN_KEY = 'mx_client_login'
export const CHAT_IDP_ID = 'oidc-ory'
export const CHAT_USER_ID_KEY: MatrixUserKey = 'mx_user_id'
export const CHAT_DEVICE_ID_KEY: MatrixDeviceIdKey = 'mx_device'
export const CURRENT_ROOM_KEY: CurrentRoomKey = 'mx_current_room'
