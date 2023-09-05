import Constants from 'expo-constants'

export interface HoliChatConfig {
  serverName: string
  serverLoginUrl: string
  serverUrl: string
  pushGatewayUrl: string
}

export interface HoliOryConfig {
  url: string
}

export interface HoliApiConfig {
  url: string
  gateway: string
}

export interface HoliNextJsApiConfig {
  url: string
}

export interface HoliSentryConfig {
  dsn: string
}

export interface HoliOwnCloudConfig {
  url: string
}

export interface HoliJitsiConfig {
  url: string
}

export interface HoliEASConfig {
  projectId: string
}

export interface HoliE2EConfig {
  userId: string | undefined
}

export interface HoliConfig {
  chat: HoliChatConfig
  ory: HoliOryConfig
  holi_api: HoliApiConfig
  holi_nextjs_api: HoliNextJsApiConfig
  environment: string
  sentry: HoliSentryConfig
  owncloud: HoliOwnCloudConfig
  jitsi: HoliJitsiConfig
  eas: HoliEASConfig
  e2e: HoliE2EConfig
}

export const config: HoliConfig = {
  chat: {
    serverName: Constants.expoConfig?.extra?.chat.serverName,
    serverLoginUrl: Constants.expoConfig?.extra?.chat.serverLoginUrl,
    serverUrl: Constants.expoConfig?.extra?.chat.serverUrl,
    pushGatewayUrl: Constants.expoConfig?.extra?.chat.pushGatewayUrl,
  },
  ory: {
    url: Constants.expoConfig?.extra?.ory.url,
  },
  holi_api: {
    url: Constants.expoConfig?.extra?.holi_api.url,
    gateway: Constants.expoConfig?.extra?.holi_api.gateway,
  },
  holi_nextjs_api: {
    url: Constants.expoConfig?.extra?.holi_nextjs_api.url,
  },
  environment: Constants.expoConfig?.extra?.environment,
  sentry: {
    dsn: Constants.expoConfig?.extra?.sentry.dsn,
  },
  owncloud: {
    url: Constants.expoConfig?.extra?.owncloud.url,
  },
  jitsi: {
    url: Constants.expoConfig?.extra?.jitsi.url,
  },
  eas: {
    projectId: Constants.expoConfig?.extra?.eas.projectId,
  },
  e2e: {
    userId: Constants.expoConfig?.extra?.e2e.userId,
  },
}
