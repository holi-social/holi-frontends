import type { MatrixClient } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'

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

  public getRedirectURL(): string | null {
    const client = this.#createTemporaryClient()

    return client.getSsoLoginUrl(this.callbackUrl, 'sso', this.idp_id, SSOAction.LOGIN)
  }

  public clearTemporaryClient(): void {
    this.#client = null
  }
}
