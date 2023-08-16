import Constants from 'expo-constants'

export interface HoliChatConfig {
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
    serverLoginUrl: Constants.manifest?.extra?.chat.serverLoginUrl,
    serverUrl: Constants.manifest?.extra?.chat.serverUrl,
    pushGatewayUrl: Constants.manifest?.extra?.chat.pushGatewayUrl,
  },
  ory: {
    url: Constants.manifest?.extra?.ory.url,
  },
  holi_api: {
    url: Constants.manifest?.extra?.holi_api.url,
    gateway: Constants.manifest?.extra?.holi_api.gateway,
  },
  holi_nextjs_api: {
    url: Constants.manifest?.extra?.holi_nextjs_api.url,
  },
  environment: Constants.manifest?.extra?.environment,
  sentry: {
    dsn: Constants.manifest?.extra?.sentry.dsn,
  },
  owncloud: {
    url: Constants.manifest?.extra?.owncloud.url,
  },
  jitsi: {
    url: Constants.manifest?.extra?.jitsi.url,
  },
  eas: {
    projectId: Constants.manifest?.extra?.eas.projectId,
  },
  e2e: {
    userId: Constants.manifest?.extra?.e2e.userId,
  },
}
