import AsyncStore from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import type { IMatrixClientCreateOpts, MatrixClient } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'
import { SyncState } from 'matrix-js-sdk/lib/sync'
import { Platform } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { isString } from '@holi/core/helpers'

// TODO: remove fallbacks
const HOMESERVER_TOKEN_KEY = Constants.manifest?.extra?.chat.homeserverToken || 'mx_sso_token'
//const HOMESERVER_URL_KEY = Constants.manifest?.extra?.chat.homeserverUrlKey || 'mx_sso_hs_url'
const HOMESERVER_URL = Constants.manifest?.extra?.chat.homeserverUrl || 'https://local.chat.holi.social'
const HOMESERVER_NAME = Constants.manifest?.extra?.chat.homeserverName || 'local.chat.holi.social'
const HOMESERVER_LOGIN_KEY = 'mx_client_login'
const IDP_ID = 'oidc-ory'

export enum SSOAction {
  LOGIN = 'login',
  REGISTER = 'register',
}

export type ServerName = 'local.chat.holi.social'
export type UserName = `@${string}:${ServerName}`

export type MatrixDeviceName = `holi-${Platform['OS']}`
export type ServerNameKey = 'mx_sso_hs_url'
export type ServerTokenKey = 'mx_sso_token'
export type MatrixDeviceIdKey = 'mx_device'
export type MatrixLoginKey = 'mx_client_login'

/**
 * A temporary client that can be used to login or register a user in the Matrix server.
 */
export default class MatrixLogin {
  // TODO: replace private with native private class properties e.g. #client
  // RN has an issue with the @babel/plugin-proposal-private-methods in
  // combination with Flatlist's.
  // https://github.com/facebook/react-native/issues/36828
  private client: MatrixClient | null = null
  private readonly homeserverUrl: string = HOMESERVER_URL
  private readonly matrixLoginKey: MatrixLoginKey = HOMESERVER_LOGIN_KEY
  private readonly idp_id = IDP_ID

  readonly homeserverTokenKey: ServerTokenKey = HOMESERVER_TOKEN_KEY
  readonly deviceIdKey: MatrixDeviceIdKey = 'mx_device'
  readonly deviceName: MatrixDeviceName = `holi-${Platform.OS}`

  static readonly homeserverName: ServerName = HOMESERVER_NAME

  static transformUserName(name: string): UserName {
    return `@${name.replace(' ', '')}:${this.homeserverName}`
  }

  private createTemporaryClient(options?: IMatrixClientCreateOpts): MatrixClient {
    if (this.client) return this.client

    this.client = createClient({
      baseUrl: this.homeserverUrl,
      ...options,
    })

    return this.client
  }

  public constructor(private readonly callbackUrl: string) {}

  public getRedirectURL(action: SSOAction): string | null {
    try {
      const client = this.createTemporaryClient()
      this.client = null

      return client.getSsoLoginUrl(this.callbackUrl, 'sso', this.idp_id, action)
    } catch (err) {
      logError(err)
      return null
    }
  }

  public login = async (token: string | null): Promise<void> => {
    const client = this.createTemporaryClient()
    if (client.clientRunning) return

    const { access_token, device_id } = await client.login('m.login.token', {
      token: token,
      initial_device_display_name: this.deviceName,
    })

    if (!isString(access_token)) {
      AsyncStore.setItem(this.matrixLoginKey, 'false').catch((err) => logError(err))
      return
    }
    if (!isString(device_id)) return

    await client.startClient()

    // TODO: fix type error
    client.once('sync', (state: SyncState) => {
      // TODO: create persitent client with login result
      // TODO: logout user on logout
      // TODO: remove console.log

      // eslint-disable-next-line no-console
      console.log({ state }, 'chat sync state ------') // state will be 'PREPARED' when the client is ready to use

      if (state === SyncState.Prepared) {
        const multiSet: [string, string][] = [
          [this.homeserverTokenKey, access_token],
          [this.deviceIdKey, device_id],
          [this.matrixLoginKey, 'true'],
        ]

        AsyncStore.multiSet(multiSet).catch((err) => logError(err))
      }
    })

    this.client = null
  }

  public getLoginStatus = async (): Promise<boolean> => {
    const isLoggedin = await AsyncStore.getItem(this.matrixLoginKey)
    return isLoggedin ? JSON.parse(isLoggedin) : false
  }
}
