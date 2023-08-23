import { environment } from '@holi/core/helpers/environment'
import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

export const chatServerName = (() => {
  const serverName = environment === EnvironmentId.PRODUCTION ? 'holi.social' : 'development-chat.holi.social'
  return process.env.NEXT_PUBLIC_HOLI_CHAT_SERVER_NAME || serverName
})()

export const chatServerUrl = (() => {
  const baseUrl = 'https://' + chatServerName
  return process.env.NEXT_PUBLIC_HOLI_CHAT_SERVER_URL || baseUrl
})()

export const chatServerLoginUrl = '/api/chatlogin'

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
