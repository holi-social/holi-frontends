import fetch from 'cross-fetch'
// The Matrix SDK uses the TextEncoder internally.
// Unfortunately, the Hermes JS engine does not support TextEncoder or TextDecoder.
// We need this lightweight polyfill to support mobile.
import 'fast-text-encoding'
import type { TFunction } from 'i18next'
import { Platform } from 'react-native'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { initChatClient } from '@holi/chat/src/store'
import type { MatrixDeviceName } from '@holi/chat/src/utils/constants'
import {
  StoredCredentials as SessionCredentials,
  clearSessionCredentials,
  loadSessionCredentials,
  storeSessionCredentials,
} from '@holi/chat/src/utils/storage'
import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError, logInfo, logInfoMsg } from '@holi/core/errors/helpers'
import { chatServerLoginUrl, chatServerUrl } from '@holi/core/helpers/config'
import { getLogger } from '@holi/core/helpers/logging'
import { registerDeviceTokenListener } from '@holi/core/screens/notifications/helpers/getDeviceToken'

import { chatReloadCounter, setChatConnected, setChatInitialized } from './chatState'

const logger = getLogger('Chat')

export enum SSOAction {
  LOGIN = 'login',
  REGISTER = 'register',
}

interface MatrixLoginResponse {
  access_token: string
  user_id: string
  device_id: string
  fresh_login: boolean
}

let chatClient: ChatClient | undefined = undefined
let isStarting = false
let isStopping = false

const unknownTokenHandler = async (t: TFunction, deviceToken?: string): Promise<void> => {
  if (!isStopping) {
    logInfoMsg('[chatSession] chat client has an invalid token: reconnecting')
    try {
      await stopChat()
    } catch (e) {
      logInfo(e, '[chatSession] could not stop chatClient. This is expected.')
    } finally {
      await startChat(t, deviceToken)
    }
  }
}

export const startChat = async (t: TFunction, deviceToken?: string): Promise<void> => {
  if (isStarting || isStopping || chatClient?.isRunning()) return

  isStarting = true
  logger.debug('chatSession.startChat', 'isStarting')

  try {
    // initialize ChatClient here as this is *the* lifecycle hook where all of chat is initialized
    const orySession = await getSessionFromStorage()
    if (!orySession) {
      throw new HoliError('[ChatLogin]: Can not start chat without Ory session token')
    }
    const credentials = await ensureChatLoggedIn(orySession.session_token)
    chatClient = new ChatClient(
      {
        baseUrl: chatServerUrl,
        accessToken: credentials.access_token,
        deviceId: credentials.device_id,
        userId: credentials.user_id,
        freshLogin: credentials.fresh_login,
        deviceToken,
      },
      t
    )

    // make compiler believe that chatClient is in fact defined
    if (chatClient === undefined) throw new HoliError('[ChatLogin]: this should not happen')

    await chatClient.start(() => unknownTokenHandler(t, deviceToken))
    initChatClient(chatClient)
    await chatClient.configurePusher(t).catch((e) => {
      logError(e, 'Could not set up push notifications for chat', { location: 'chatSession.startChat.configurePusher' })
    })
    registerDeviceTokenListener((token) => {
      chatClient?.updateDeviceToken(token, t)
    })
    setChatConnected(true)
  } finally {
    isStarting = false
  }
}

const stopChat = async () => {
  if (!chatClient || isStopping) return // chatClient never started or already stopping

  isStopping = true
  isStarting = false // stopping has priority over starting. This is particularly important for re-connecting in case of startup failures
  logger.debug('chatSession.stopChat', 'isStopping')
  setChatInitialized(false)
  setChatConnected(false)
  chatReloadCounter(chatReloadCounter() + 1)

  try {
    await logoutChat()
    await chatClient.stop()
  } catch (e) {
    logInfo(e, '[chatSession] could not stop chatClient. This is probably not a problem.')
  } finally {
    chatClient = undefined
    initChatClient(undefined)
    isStopping = false
  }
}

// TODO the class has no state in itself, consider refactoring this as functions / static methods.
const serverLoginUrl = chatServerLoginUrl + '/_matrix/client/r0/login'
const deviceName: MatrixDeviceName = `holi-${Platform.OS}`
/**
 * @name ChatLogin
 * @description a disposable/temporary Matrix client necessary to log in to the
 * user for the first time on each session.
 */

const ensureChatLoggedIn = async (orySessionToken?: string, freshLogin = true): Promise<SessionCredentials> => {
  // fetch only if no Matrix session data found
  const storedSessionCredentials = await loadSessionCredentials()
  if (storedSessionCredentials?.access_token) {
    return storedSessionCredentials
  } else {
    return await storeSessionCredentials(await loginChat(orySessionToken, freshLogin))
  }
}

export const ensureChatLoggedOut = async () => {
  try {
    if (chatClient) await stopChat()
    else await logoutChat()
  } catch (error) {
    logError(error, 'Failed to logout chat', { location: 'chatSession.ensureChatLoggedOut' })
  }
}

const loginChat = async (orySessionToken?: string, freshLogin = true): Promise<SessionCredentials> => {
  const response = await fetch(serverLoginUrl, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7,en-DE;q=0.6',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      ...(orySessionToken ? { authorization: `Bearer ${orySessionToken}` } : {}),
    },
    referrerPolicy: 'no-referrer',
    body: `{"type":"org.matrix.login.jwt","initial_device_display_name":"${deviceName}"}`,
    method: 'POST',
    mode: 'cors',
  })

  if (response.ok) {
    const responseJson = (await response.json()) as MatrixLoginResponse
    return {
      ...responseJson,
      fresh_login: freshLogin,
    }
  } else {
    throw new HoliError(`[ChatLogin]: request to Matrix login ended up with ${response.status} status code`)
  }
}

const logoutChat = async (): Promise<void> => {
  await clearSessionCredentials()
}
