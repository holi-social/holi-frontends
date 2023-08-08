import AsyncStore from '@react-native-async-storage/async-storage'
import fetch from 'cross-fetch'
// The Matrix SDK uses the TextEncoder internally.
// Unfortunately, the Hermes JS engine does not support TextEncoder or TextDecoder.
// We need this lightweight polyfill to support mobile.
import 'fast-text-encoding'
import type { MatrixClient } from 'matrix-js-sdk'
import { Platform } from 'react-native'

import {
  CHAT_LOCAL_STORAGE_KEY_DEVICE_ID,
  CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN,
  CHAT_LOCAL_STORAGE_KEY_TOKEN,
  CHAT_LOCAL_STORAGE_KEY_USER_ID,
} from '@holi/chat/src/utils/constants'
import type { MatrixDeviceName } from '@holi/chat/src/utils/constants'
import { getStoredSessionCreds } from '@holi/chat/src/utils/storage'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { chatLoginUrl } from '@holi/core/helpers/config'

export enum SSOAction {
  LOGIN = 'login',
  REGISTER = 'register',
}

interface LoginCredentials {
  access_token: string
  user_id: string
  device_id: string
  fresh_login: boolean
}

/**
 * @name ChatLogin
 * @description a disposable/temporary Matrix client necessary to log in to the
 * user for the first time on each session.
 */
export default class ChatLogin {
  // TODO: replace private with native private class properties e.g. #client
  // RN has an issue with the @babel/plugin-proposal-private-methods in
  // combination with Flatlist's.
  // https://github.com/facebook/react-native/issues/36828
  private mxClient: MatrixClient | null = null
  private readonly serverLoginUrl = chatLoginUrl + '/_matrix/client/r0/login'

  readonly deviceName: MatrixDeviceName = `holi-${Platform.OS}`

  /**
   * Removes all the stored chat client credentials.
   */
  private clearSessionCredentials = async (): Promise<void> => {
    await AsyncStore.multiRemove([
      CHAT_LOCAL_STORAGE_KEY_TOKEN,
      CHAT_LOCAL_STORAGE_KEY_DEVICE_ID,
      CHAT_LOCAL_STORAGE_KEY_USER_ID,
      CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN,
    ])
  }

  private saveCredentials = async ({
    access_token,
    user_id,
    device_id,
    fresh_login,
  }: LoginCredentials): Promise<void> => {
    await this.clearSessionCredentials()

    // Reset newly received credentials
    const multiSetCreds: [string, string][] = [
      // TODO: the `access_token` should be stored with some kind of encryption
      [CHAT_LOCAL_STORAGE_KEY_TOKEN, access_token],
      [CHAT_LOCAL_STORAGE_KEY_DEVICE_ID, device_id],
      [CHAT_LOCAL_STORAGE_KEY_USER_ID, user_id],
      [CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN, `${fresh_login}`],
    ]

    await AsyncStore.multiSet(multiSetCreds).catch((err) => logError(err))
  }

  public fetchSessionCredentials = async (orySessionToken?: string, freshLogin = true): Promise<void> => {
    // fetch only if no Matrix session data found
    const sessionCredentials = await getStoredSessionCreds()
    if (sessionCredentials.accessToken) return

    const response = await fetch(this.serverLoginUrl, {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7,en-DE;q=0.6',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        ...(orySessionToken ? { authorization: `Bearer ${orySessionToken}` } : {}),
      },
      referrerPolicy: 'no-referrer',
      body: `{"type":"org.matrix.login.jwt","initial_device_display_name":"${this.deviceName}"}`,
      method: 'POST',
      mode: 'cors',
    })

    if (response.ok) {
      const credentials: LoginCredentials = await response.json()
      await this.saveCredentials({ ...credentials, fresh_login: freshLogin })
    } else {
      throw new HoliError(`[ChatLogin]: request to Matrix login ended up with ${response.statusText} status code`)
    }
  }

  public logout = async (): Promise<void> => {
    await this.clearSessionCredentials()
  }

  public getSessionCredentials = async (): Promise<ChatCredentials> => {
    const sessionCredentials = await getStoredSessionCreds()

    // TODO abort/retry loging on missing access
    if (sessionCredentials.accessToken.length === 0) throw new Error('unable to restore local session credentials')

    if (sessionCredentials.freshLogin === true) {
      await AsyncStore.setItem(CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN, 'false')
    }

    return sessionCredentials
  }

  public getLoginStatus = async (): Promise<boolean> => {
    const isLoggedin = await AsyncStore.getItem(CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN)
    return isLoggedin ? JSON.parse(isLoggedin) : false
  }

  public retryLogin = async (): Promise<ChatCredentials> => {
    const orySession = await getSessionFromStorage()

    if (!orySession) throw new HoliError('Unable to restore local Ory session credentials')

    await this.fetchSessionCredentials(orySession?.session_token, false)
    return await this.getSessionCredentials()
  }
}
