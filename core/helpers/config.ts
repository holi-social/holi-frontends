import Constants from 'expo-constants'

export const chatServerName: string = Constants.expoConfig?.extra?.chat.serverName
export const chatServerUrl = Constants.expoConfig?.extra?.chat.serverUrl
export const chatAdminUserId = Constants.expoConfig?.extra?.chat.adminUserId
export const chatServerLoginUrl = Constants.expoConfig?.extra?.chat.serverLoginUrl
export const chatPushGatewayUrl = Constants.expoConfig?.extra?.chat.pushGatewayUrl
export const chatAdminName = Constants.expoConfig?.extra?.chat.adminName
export const jitsiUrl = Constants.expoConfig?.extra?.jitsi.url
export const posthogKey = Constants.expoConfig?.extra?.posthog.key
export const posthogHost = Constants.expoConfig?.extra?.posthog.host
export const challengeAppBaseUrl = Constants.expoConfig?.extra?.challengesApp
export const appcuesAccountId = Constants.expoConfig?.extra?.appcues?.accountId
export const appcuesAppId = Constants.expoConfig?.extra?.appcues?.appId
