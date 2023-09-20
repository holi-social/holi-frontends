import Constants from 'expo-constants'

export const chatServerName: string = Constants.expoConfig?.extra?.chat.serverName
export const chatServerUrl = Constants.expoConfig?.extra?.chat.serverUrl
export const chatServerLoginUrl = Constants.expoConfig?.extra?.chat.serverLoginUrl
export const chatPushGatewayUrl = Constants.expoConfig?.extra?.chat.pushGatewayUrl
export const owncloudUrl = Constants.expoConfig?.extra?.owncloud.url
export const jitsiUrl = Constants.expoConfig?.extra?.jitsi.url

export const perspectiveKey = Constants.expoConfig?.extra?.moderation.perspectiveKey
export const perspectiveUrl = Constants.expoConfig?.extra?.moderation.perspectiveUrl
