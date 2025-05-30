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

export interface HoliSocialLoginConfig {
  googleIosClientId: string
  googleWebClientId: string
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
  socialLogin: HoliSocialLoginConfig
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
  socialLogin: {
    googleIosClientId: Constants.expoConfig?.extra?.socialLogin.googleIosClientId,
    googleWebClientId: Constants.expoConfig?.extra?.socialLogin.googleWebClientId,
  },
}
