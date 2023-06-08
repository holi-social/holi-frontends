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

// TODO: remove fallbacks
export const HOMESERVER_TOKEN_KEY = Constants.manifest?.extra?.chat.homeserverToken || 'mx_sso_token'
//const HOMESERVER_URL_KEY = Constants.manifest?.extra?.chat.homeserverUrlKey || 'mx_sso_hs_url'
export const HOMESERVER_URL = Constants.manifest?.extra?.chat.homeserverUrl || 'https://local.chat.holi.social'
export const HOMESERVER_NAME = Constants.manifest?.extra?.chat.homeserverName || 'local.chat.holi.social'
export const HOMESERVER_LOGIN_KEY = 'mx_client_login'
export const IDP_ID = 'oidc-ory'
export const HOMESERVER_USER_ID_KEY: MatrixUserKey = 'mx_user_id'
export const HOMESERVER_DEVICE_ID_KEY: MatrixDeviceIdKey = 'mx_device'
