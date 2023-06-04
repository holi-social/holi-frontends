import type { MatrixClient } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'

import { logError } from '@holi/core/errors/helpers'

export enum SSOAction {
  LOGIN = 'login',
  REGISTER = 'register',
}

/**
 * A temporary client that can be used to login or register a user in the Matrix server.
 */
export default class Login {
  #client: MatrixClient | null = null
  public readonly idp_id = 'oidc-ory'

  #createTemporaryClient(): MatrixClient {
    if (this.#client) return this.#client

    return createClient({
      baseUrl: this.homeserverUrl,
    })
  }

  public constructor(private readonly homeserverUrl: string, private readonly callbackUrl: string) {}

  public getRedirectURL(action: SSOAction): string | null {
    try {
      const client = this.#createTemporaryClient()

      return client.getSsoLoginUrl(this.callbackUrl, 'sso', this.idp_id, action)
    } catch (err) {
      logError(err)

      return null
    }
  }

  public clearTemporaryClient(): void {
    this.#client = null
  }
}
