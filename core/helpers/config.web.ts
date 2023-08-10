import { environment } from '@holi/core/helpers/environment'
import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

const withoutTrailingSlash = (url: string) => url.replace(/\/$/, '')

export const chatServerName = (() => {
  const serverName =
    environment === EnvironmentId.PRODUCTION ? 'production.chat.holi.social' : 'staging.chat.holi.social'
  return process.env.NEXT_PUBLIC_HOLI_CHAT_SERVER_NAME || serverName
})()

export const chatUrl = (() => {
  const baseUrl = 'https://' + chatServerName
  return process.env.NEXT_PUBLIC_HOLI_CHAT_SERVER_URL || baseUrl
})()

export const chatLoginUrl = (() => {
  const defaultBaseUrl =
    environment === EnvironmentId.PRODUCTION ? 'https://app.holi.social/' : 'https://staging.dev.holi.social/'
  const baseUrl = withoutTrailingSlash(process.env.NEXT_PUBLIC_HOLI_API_GATEWAY || defaultBaseUrl)
  return baseUrl + '/api/chatlogin'
})()

export const owncloudUrl = (() => {
  const baseUrl =
    environment === EnvironmentId.PRODUCTION
      ? 'https://production.cloud.holi.social'
      : 'https://development.cloud.holi.social'
  return process.env.NEXT_PUBLIC_OWNCLOUD_BASE_URL || baseUrl
})()

export const jitsiUrl = (() => {
  const baseUrl =
    environment === EnvironmentId.PRODUCTION ? 'https://meet.holi.social' : 'https://development.meet.holi.social'
  return process.env.NEXT_PUBLIC_JITSI_URL || baseUrl
})()
