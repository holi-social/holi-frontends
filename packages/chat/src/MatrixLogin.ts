import Constants from 'expo-constants'
import type { IMatrixClientCreateOpts, MatrixClient } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'
import { Platform } from 'react-native'

import { logError } from '@holi/core/errors/helpers'

// TODO: remove fallbacks
const HOMESERVER_URL_KEY = Constants.manifest?.extra?.chat.homeserverUrlKey || 'mx_sso_hs_url'
const HOMESERVER_URL = Constants.manifest?.extra?.chat.homeserverUrl || 'https://local.chat.holi.social'
const HOMESERVER_NAME = Constants.manifest?.extra?.chat.homeserverName || 'local.chat.holi.social'
const IDP_ID = 'oidc-ory'

export enum SSOAction {
  LOGIN = 'login',
  REGISTER = 'register',
}

export type ServerName = 'local.chat.holi.social'
export type UserName = `@${string}:${ServerName}`
export type ServerNameKey = 'mx_sso_hs_url'

/**
 * A temporary client that can be used to login or register a user in the Matrix server.
 */
export default class MatrixLogin {
  // TODO: replace private with native private class properties e.g. #client
  // RN has an issue with the @babel/plugin-proposal-private-methods in
  // combination with Flatlist's.
  // https://github.com/facebook/react-native/issues/36828
  private client: MatrixClient | null = null
  private homeserverUrl: string = HOMESERVER_URL
  private idp_id = IDP_ID

  readonly homeserverKey: ServerNameKey = HOMESERVER_URL_KEY
  readonly deviceName: string = 'holi-' + Platform.OS

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

  public getTemporaryClient(): (options?: IMatrixClientCreateOpts) => MatrixClient {
    return (options?: IMatrixClientCreateOpts) => this.createTemporaryClient(options)
  }

  public clearTemporaryClient(): void {
    this.client = null
  }
}
