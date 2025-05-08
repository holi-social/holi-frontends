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

export interface HoliJitsiConfig {
  url: string
}

export interface HoliEASConfig {
  projectId: string
  buildId: string | undefined
  profile: string | undefined
  gitCommitHash: string | undefined
}

export interface HoliE2EConfig {
  userId: string | undefined
}

export interface HoliNovuConfig {
  applicationIdentifier: string
  backendUrl: string
  socketUrl: string
  credentialsUrl: string
}

export interface HoliTypesenseConfig {
  host: string
  port: number
  protocol: string
  apiKey: string // be sure to use an API key that only allows search operations
  collection: string
}

export interface HoliConfig {
  novu: HoliNovuConfig
  chat: HoliChatConfig
  ory: HoliOryConfig
  holi_api: HoliApiConfig
  holi_nextjs_api: HoliNextJsApiConfig
  environment: string
  sentry: HoliSentryConfig
  jitsi: HoliJitsiConfig
  eas: HoliEASConfig
  e2e: HoliE2EConfig
  typesense: HoliTypesenseConfig
}

export const config: HoliConfig = {
  novu: {
    applicationIdentifier: Constants.expoConfig?.extra?.novu.applicationIdentifier,
    backendUrl: Constants.expoConfig?.extra?.novu.backendUrl,
    socketUrl: Constants.expoConfig?.extra?.novu.socketUrl,
    credentialsUrl: Constants.expoConfig?.extra?.novu.credentialsUrl,
  },
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
  jitsi: {
    url: Constants.expoConfig?.extra?.jitsi.url,
  },
  eas: {
    projectId: Constants.expoConfig?.extra?.eas.projectId,
    buildId: Constants.expoConfig?.extra?.eas.buildId,
    profile: Constants.expoConfig?.extra?.eas.profile,
    gitCommitHash: Constants.expoConfig?.extra?.eas.gitCommitHash,
  },
  e2e: {
    userId: Constants.expoConfig?.extra?.e2e.userId,
  },
  typesense: {
    host: Constants.expoConfig?.extra?.typesense.host,
    port: Constants.expoConfig?.extra?.typesense.port,
    protocol: Constants.expoConfig?.extra?.typesense.protocol,
    apiKey: Constants.expoConfig?.extra?.typesense.apiKey,
    collection: Constants.expoConfig?.extra?.typesense.collection,
  },
}
