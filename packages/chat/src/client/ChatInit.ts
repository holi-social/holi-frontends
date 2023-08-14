import { createStore } from 'jotai'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { ensureChatLoggedIn, logoutChat } from '@holi/chat/src/client/ChatLogin'
import { initChatClient } from '@holi/chat/src/store'
import { StoredCredentials } from '@holi/chat/src/utils'
import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { chatUrl } from '@holi/core/helpers/config'

/** Store **/
export const chatStore = createStore()

/** Client **/
let chatClient: ChatClient | undefined = undefined
let isStarting = false
let isStopping = false

export const startChat = async (): Promise<void> => {
  if (chatClient?.isOn || isStarting) return

  isStarting = true

  try {
    // initialize ChatClient here as this is *the* lifecycle hook where all of chat is initialized
    chatClient = await getSessionFromStorage()
      .then((orySession) => {
        if (!orySession) {
          throw new HoliError('[ChatInit]: Can not start chat without Ory session token')
        }
        return ensureChatLoggedIn(orySession.session_token)
      })
      .then((credentials: StoredCredentials) => {
        return new ChatClient({
          baseUrl: chatUrl,
          accessToken: credentials.access_token,
          deviceId: credentials.device_id,
          userId: credentials.user_id,
          freshLogin: credentials.fresh_login,
        })
      })

    initChatClient(chatClient)
    // make compiler believe that chatClient is in fact defined
    if (chatClient === undefined) throw new HoliError('[ChatInit]: this should not happen')

    await chatClient.start()
  } finally {
    isStarting = false
  }
}

export const stopChat = async () => {
  if (!chatClient) return // chatClient never started
  if (!chatClient.isOn || isStopping) return

  isStopping = true

  try {
    await chatClient.stop()
    await logoutChat()
  } finally {
    isStopping = false
  }
}
