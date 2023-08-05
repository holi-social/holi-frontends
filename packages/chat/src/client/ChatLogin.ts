import AsyncStore from '@react-native-async-storage/async-storage'
import fetch from 'cross-fetch'
// The Matrix SDK uses the TextEncoder internally.
// Unfortunately, the Hermes JS engine does not support TextEncoder or TextDecoder.
// We need this lightweight polyfill to support mobile.
import 'fast-text-encoding'
import { Platform } from 'react-native'

import { CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN } from '@holi/chat/src/utils/constants'
import type { MatrixDeviceName } from '@holi/chat/src/utils/constants'
import {
  StoredCredentials,
  clearSessionCredentials,
  getStoredSessionCreds,
  saveCredentials,
} from '@holi/chat/src/utils/storage'
import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { chatLoginUrl } from '@holi/core/helpers/config'

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
  private readonly serverLoginUrl = chatLoginUrl + '/_matrix/client/r0/login'

  readonly deviceName: MatrixDeviceName = `holi-${Platform.OS}`

  public fetchSessionCredentials = async (orySessionToken: string, freshLogin = true): Promise<StoredCredentials> => {
    // fetch only if no Matrix session data found
    const sessionCredentials = await getStoredSessionCreds()
    if (sessionCredentials.access_token) return sessionCredentials

    const response = await fetch(this.serverLoginUrl, {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7,en-DE;q=0.6',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        authorization: `Bearer ${orySessionToken}`,
      },
      referrerPolicy: 'no-referrer',
      body: `{"type":"org.matrix.login.jwt","initial_device_display_name":"${this.deviceName}"}`,
      method: 'POST',
      mode: 'cors',
    })

    if (!response.ok) throw new Error('Unable to fetch session credentials')

    const credentials: MatrixLoginResponse = await response.json()
    return await saveCredentials({ ...credentials, fresh_login: freshLogin })
  }

  public logout = async (): Promise<void> => {
    await clearSessionCredentials()
  }

  public getSessionCredentials = async (): Promise<StoredCredentials> => {
    const sessionCredentials = await getStoredSessionCreds()
    console.debug('sessionCredentials', sessionCredentials)
    // TODO abort/retry loging on missing access
    if (!sessionCredentials.access_token) throw new Error('unable to restore local session credentials')

    if (sessionCredentials.fresh_login === true) {
      await AsyncStore.setItem(CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN, 'false')
    }

    return sessionCredentials
  }

  public getLoginStatus = async (): Promise<boolean> => {
    const isLoggedin = await AsyncStore.getItem(CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN)
    return isLoggedin ? JSON.parse(isLoggedin) : false
  }

  public retryLogin = async (): Promise<void> => {
    const orySession = await getSessionFromStorage()

    if (!orySession) throw new HoliError('Unable to restore local Ory session credentials')

    await this.fetchSessionCredentials(orySession?.session_token, false)
    await this.getSessionCredentials()
  }
}
