import AsyncStore from '@react-native-async-storage/async-storage'
import type { IMatrixClientCreateOpts, MatrixClient } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'
import { Platform } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { isString } from '@holi/core/helpers'

import mxClient from './ChatClient'
import {
  CHAT_FRESH_LOGIN_KEY,
  CHAT_IDP_ID,
  CHAT_NAME,
  CHAT_TOKEN_KEY,
  CHAT_URL,
  CHAT_USER_ID_KEY,
} from './utils/constants'
import type {
  MatrixDeviceIdKey,
  MatrixDeviceName,
  MatrixLoginKey,
  MatrixUserKey,
  ServerName,
  ServerTokenKey,
  UserName,
} from './utils/constants'
import { getStoredSessionCreds } from './utils/storage'

export enum SSOAction {
  LOGIN = 'login',
  REGISTER = 'register',
}

/**
 * A temporary client that can be used to login or register a user in the Matrix server.
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

  readonly homeserverTokenKey: ServerTokenKey = CHAT_TOKEN_KEY
  readonly deviceIdKey: MatrixDeviceIdKey = 'mx_device'
  readonly deviceName: MatrixDeviceName = `holi-${Platform.OS}`

  static readonly homeserverName: ServerName = CHAT_NAME

  static transformUserName(name: string): UserName {
    return `@${name.replace(' ', '')}:${this.homeserverName}`
  }

  private createTemporaryClient(options?: IMatrixClientCreateOpts): MatrixClient {
    if (this.mxClient) return this.mxClient

    this.mxClient = createClient({
      baseUrl: this.serverUrl,
      ...options,
    })

    return this.mxClient
  }

  public constructor(private readonly callbackUrl: string) {}

  public getRedirectURL(action: SSOAction): string | null {
    try {
      const client = this.createTemporaryClient()
      this.mxClient = null

      return client.getSsoLoginUrl(this.callbackUrl, 'sso', this.chat_idp_id, action)
    } catch (err) {
      logError(err)
      return null
    }
  }

  public login = async (token: string | undefined): Promise<boolean> => {
    if (!token) return false
    const client = this.createTemporaryClient()

    const { access_token, device_id, user_id } = await client.login('m.login.token', {
      token: token,
      initial_device_display_name: this.deviceName,
    })

    if (!isString(access_token) || !isString(device_id)) {
      AsyncStore.setItem(this.freshLogin, 'false').catch((err) => logError(err))
      return false
    }

    // Remove previously stored credentials
    await AsyncStore.multiRemove([this.homeserverTokenKey, this.deviceIdKey, this.deviceIdKey, this.freshLogin])

    // Reset newly received credentials
    const multiSetCreds: [string, string][] = [
      // TODO: the `access_token` should be stored with some kind of encryption
      [this.homeserverTokenKey, access_token],
      [this.deviceIdKey, device_id],
      [this.userIdKey, user_id],
      [this.freshLogin, 'true'],
    ]
    await AsyncStore.multiSet(multiSetCreds).catch((err) => logError(err))

    return true
  }

  public restoreSession = async (client: typeof mxClient): Promise<typeof mxClient> => {
    const { accessToken, baseUrl, userId, guest, deviceId, freshLogin } = await getStoredSessionCreds()

    // TODO abort/retry loging on missing access
    if (accessToken.length === 0) return client

    if (freshLogin === true) {
      await AsyncStore.removeItem(this.freshLogin)
    }

    // Restoring session for userId
    client.replaceUsingCreds({ baseUrl, userId, accessToken, deviceId, guest, freshLogin })

    // TODO: Rehydrate client's device instead of using a new device for each session

    return client
  }

  public getLoginStatus = async (): Promise<boolean> => {
    const isLoggedin = await AsyncStore.getItem(this.freshLogin)
    return isLoggedin ? JSON.parse(isLoggedin) : false
  }
}
