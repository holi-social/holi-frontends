import AsyncStore from '@react-native-async-storage/async-storage'
import fetch from 'cross-fetch'
// The Matrix SDK uses the TextEncoder internally.
// Unfortunately, the Hermes JS engine does not support TextEncoder or TextDecoder.
// We need this lightweight polyfill to support mobile.
import 'fast-text-encoding'
import type { MatrixClient } from 'matrix-js-sdk'
import { Platform } from 'react-native'

import {
  CHAT_FRESH_LOGIN_KEY,
  CHAT_IDP_ID,
  CHAT_LOGIN_URL,
  CHAT_TOKEN_KEY,
  CHAT_URL,
  CHAT_USER_ID_KEY,
} from '@holi/chat/src/utils/constants'
import type {
  MatrixDeviceIdKey,
  MatrixDeviceName,
  MatrixLoginKey,
  MatrixUserKey,
  ServerTokenKey,
} from '@holi/chat/src/utils/constants'
import { getStoredSessionCreds } from '@holi/chat/src/utils/storage'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { logError } from '@holi/core/errors/helpers'

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
  private readonly serverUrl: string = CHAT_URL
  private readonly freshLogin: MatrixLoginKey = CHAT_FRESH_LOGIN_KEY
  private readonly userIdKey: MatrixUserKey = CHAT_USER_ID_KEY
  private readonly chat_idp_id = CHAT_IDP_ID
  private readonly serverLoginUrl = CHAT_LOGIN_URL + '/_matrix/client/r0/login'

  readonly serverTokenKey: ServerTokenKey = CHAT_TOKEN_KEY
  readonly deviceIdKey: MatrixDeviceIdKey = 'mx_device'
  readonly deviceName: MatrixDeviceName = `holi-${Platform.OS}`

  /**
   * Removes all the stored chat client credentials.
   */
  private clearSessionCredentials = async (): Promise<void> => {
    await AsyncStore.multiRemove([this.serverTokenKey, this.deviceIdKey, this.userIdKey, this.freshLogin])
  }

  private updateSessionCredentials = async ({
    access_token,
    user_id,
    device_id,
    fresh_login,
  }: LoginCredentials): Promise<void> => {
    await this.clearSessionCredentials()

    // Reset newly received credentials
    const multiSetCreds: [string, string][] = [
      // TODO: the `access_token` should be stored with some kind of encryption
      [this.serverTokenKey, access_token],
      [this.deviceIdKey, device_id],
      [this.userIdKey, user_id],
      [this.freshLogin, `${fresh_login}`],
    ]

    await AsyncStore.multiSet(multiSetCreds).catch((err) => logError(err))
  }

  public setSessionCredentials = async (freshLogin: boolean): Promise<void> => {
    const response = await fetch(this.serverLoginUrl, {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7,en-DE;q=0.6',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
      },
      referrerPolicy: 'no-referrer',
      body: '{"type":"org.matrix.login.jwt","initial_device_display_name":"' + this.deviceName + '"}',
      method: 'POST',
      mode: 'cors',
    })

    const credentials: LoginCredentials = await response.json()
    await this.updateSessionCredentials({ ...credentials, fresh_login: freshLogin })
  }

  public logout = async (): Promise<void> => {
    await this.clearSessionCredentials()
  }

  public getSessionCredentials = async (): Promise<ChatCredentials> => {
    const sessionCredentials = await getStoredSessionCreds()

    // TODO abort/retry loging on missing access
    if (sessionCredentials.accessToken.length === 0) throw new Error('unable to restore local session credentials')

    if (sessionCredentials.freshLogin === true) {
      await AsyncStore.setItem(this.freshLogin, 'false')
    }

    return sessionCredentials
  }

  public getLoginStatus = async (): Promise<boolean> => {
    const isLoggedin = await AsyncStore.getItem(this.freshLogin)
    return isLoggedin ? JSON.parse(isLoggedin) : false
  }

  public retryLogin = async (): Promise<ChatCredentials> => {
    await this.setSessionCredentials(false)
    return await this.getSessionCredentials()
  }
}
