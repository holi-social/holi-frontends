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
  // TODO: Replace with environment/platform specific url (FIXME)
  public readonly callbackUrl = new URL('http://localhost:3000/chat')

  #createTemporaryClient(): MatrixClient {
    if (this.#client) return this.#client

    return createClient({
      baseUrl: this.hsUrl,
      idBaseUrl: this.isUrl,
    })
  }

  public constructor(private readonly hsUrl: string, private readonly isUrl: string) {
    this.hsUrl = hsUrl
    this.isUrl = isUrl
  }

  public getRedirectURL(): string | null {
    const client = this.#createTemporaryClient()
    if (!client.clientRunning) return null

    this.#client = null
    return client.getSsoLoginUrl(this.callbackUrl.href, 'sso', this.idp_id, SSOAction.LOGIN)
  }
}
