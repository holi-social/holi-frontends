import { environment } from '@holi/core/helpers/environment'
import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

export const chatServerName = (() => {
  const serverName =
    environment === EnvironmentId.PRODUCTION ? 'production.chat.holi.social' : 'staging.chat.holi.social'
  return process.env.NEXT_PUBLIC_HOLI_CHAT_SERVER_NAME || serverName
})()

export const chatUrl = (() => {
  const baseUrl = 'https://' + chatServerName
  return process.env.NEXT_PUBLIC_HOLI_CHAT_SERVER_URL || baseUrl
})()

export const chatLoginUrl = '/api/chatlogin'

export const pushGatewayUrl = (() => {
  // TODO use internal hostname instead of public url https://holi.atlassian.net/browse/HOLI-5419
  const baseUrl =
    environment === EnvironmentId.PRODUCTION
      ? 'https://production-push.chat.holi.social'
      : 'https://staging-push.chat.holi.social'
  return process.env.HOLI_CHAT_PUSH_GATEWAY_URL || baseUrl
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
