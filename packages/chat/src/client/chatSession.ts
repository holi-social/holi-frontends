import { makeVar, useReactiveVar } from '@apollo/client'
import fetch from 'cross-fetch'
// The Matrix SDK uses the TextEncoder internally.
// Unfortunately, the Hermes JS engine does not support TextEncoder or TextDecoder.
// We need this lightweight polyfill to support mobile.
import 'fast-text-encoding'
import { Platform } from 'react-native'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { initChatClient } from '@holi/chat/src/store'
import { StoredCredentials } from '@holi/chat/src/utils'
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
import { chatServerLoginUrl } from '@holi/core/helpers/config'
import { chatServerUrl } from '@holi/core/helpers/config'
import { logDebug } from '@holi/core/helpers/logging'

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

const chatConnected = makeVar(false)
const chatReloadCounter = makeVar(0)
const chatInitialized = makeVar(false)

export const setChatConnected = (value: boolean) => {
  logDebug('chatSession.setChatConnected', 'setting value', value)
  chatConnected(value)
}

export const useChatConnected = () => {
  return useReactiveVar(chatConnected)
}

export const useChatReloadCounter = () => {
  return useReactiveVar(chatReloadCounter)
}

export const setChatInitialized = (value: boolean) => {
  logDebug('chatSession.setChatInitialized', 'setting value', value)
  chatInitialized(value)
}

export const useChatInitialized = () => {
  return useReactiveVar(chatInitialized)
}

const unknownTokenHandler = async (): Promise<void> => {
  if (!isStopping) {
    logInfoMsg('[chatSession] chat client has an invalid token: reconnecting')
    try {
      await stopChat()
    } catch (e) {
      logInfo(e, '[chatSession] could not stop chatClient. This is expected.')
    } finally {
      await startChat()
    }
  }
}

export const startChat = async (): Promise<void> => {
  if (isStarting || isStopping || chatClient?.isRunning()) return

  isStarting = true
  logDebug('chatSession.startChat', 'isStarting')

  try {
    // initialize ChatClient here as this is *the* lifecycle hook where all of chat is initialized
    chatClient = await getSessionFromStorage()
      .then((orySession) => {
        if (!orySession) {
          throw new HoliError('[ChatLogin]: Can not start chat without Ory session token')
        }
        return ensureChatLoggedIn(orySession.session_token)
      })
      .then((credentials: StoredCredentials) => {
        return new ChatClient({
          baseUrl: chatServerUrl,
          accessToken: credentials.access_token,
          deviceId: credentials.device_id,
          userId: credentials.user_id,
          freshLogin: credentials.fresh_login,
        })
      })

    // make compiler believe that chatClient is in fact defined
    if (chatClient === undefined) throw new HoliError('[ChatLogin]: this should not happen')

    await chatClient.start(unknownTokenHandler)
    initChatClient(chatClient)
    await chatClient.configurePusher().catch((e) => {
      logError(e, 'Could not set up push notifications for chat')
    })
    setChatConnected(true)
  } finally {
    isStarting = false
  }
}

export const stopChat = async () => {
  if (!chatClient || isStopping) return // chatClient never started or already stopping

  isStopping = true
  isStarting = false // stopping has priority over starting. This is particularly important for re-connecting in case of startup failures
  logDebug('chatSession.stopChat', 'isStopping')
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
    return Promise.resolve(storedSessionCredentials)
  } else {
    return await storeSessionCredentials(await loginChat(orySessionToken, freshLogin))
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
