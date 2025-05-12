import { environment } from '@holi/core/helpers/environment'
import { isSSR } from '@holi/core/helpers/isSSR'
import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

export const chatServerName = (() => {
  const serverName = environment === EnvironmentId.PRODUCTION ? 'holi.social' : 'development-chat.holi.social'
  return process.env.NEXT_PUBLIC_HOLI_CHAT_SERVER_NAME || serverName
})()

export const chatServerUrl = (() => {
  const baseUrl =
    environment === EnvironmentId.PRODUCTION ? 'https://chat.holi.social' : 'https://development-chat.holi.social'
  return process.env.NEXT_PUBLIC_HOLI_CHAT_SERVER_URL || baseUrl
})()

const backupChatAdminId =
  environment === EnvironmentId.PRODUCTION ? '@chat-admin:holi.social' : '@chat-admin:development-chat.holi.social'
export const chatAdminUserId = process.env.NEXT_PUBLIC_HOLI_CHAT_ADMIN_USER_ID || backupChatAdminId

export const chatServerLoginUrl = '/api/chatlogin'

export const chatAdminName = process.env.HOLI_CHAT_ADMIN_NAME || ''

export const jitsiUrl = (() => {
  const baseUrl =
    environment === EnvironmentId.PRODUCTION ? 'https://meet.holi.social' : 'https://development.meet.holi.social'
  return process.env.NEXT_PUBLIC_JITSI_URL || baseUrl
})()

// Add env vars to window interface declaration in window.d.ts
export const posthogKey = !isSSR ? window.POSTHOG_KEY : process.env.POSTHOG_KEY
export const posthogHost = !isSSR ? window.POSTHOG_HOST : process.env.POSTHOG_HOST

export const typesenseHost = !isSSR ? window.TYPESENSE_HOST : process.env.TYPESENSE_HOST
export const typesensePort = !isSSR ? window.TYPESENSE_PORT : process.env.TYPESENSE_PORT
export const typesenseProtocol = !isSSR ? window.TYPESENSE_PROTOCOL : process.env.TYPESENSE_PROTOCOL
export const typesenseApiKey = !isSSR ? window.TYPESENSE_API_KEY : process.env.TYPESENSE_API_KEY
export const typesenseCollection = !isSSR ? window.TYPESENSE_COLLECTION : process.env.TYPESENSE_COLLECTION

export const challengeAppBaseUrl = !isSSR ? window.HOLI_CHALLENGES_APP : process.env.HOLI_CHALLENGES_APP
