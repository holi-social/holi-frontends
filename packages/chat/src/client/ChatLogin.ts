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
  StoredCredentials as SessionCredentials,
  clearSessionCredentials,
  loadSessionCredentials,
  storeSessionCredentials,
} from '@holi/chat/src/utils/storage'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { chatLoginUrl } from '@holi/core/helpers/config'

import { logDebug } from './logging'

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

// TODO the class has no state in itself, consider refactoring this as functions / static methods.

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

  public ensureLoggedIn = async (orySessionToken: string, freshLogin = true): Promise<SessionCredentials> => {
    // fetch only if no Matrix session data found
    const storedSessionCredentials = await loadSessionCredentials()
    if (storedSessionCredentials?.access_token) {
      logDebug('ChatLogin.ensureLoggedIn', 'using stored session credentials')
      return Promise.resolve(storedSessionCredentials)
    } else {
      logDebug('ChatLogin.ensureLoggedIn', 'no stored session credentials found, logging in first')
      return await storeSessionCredentials(await this.login(orySessionToken, freshLogin))
    }
  }

  public login = async (orySessionToken: string, freshLogin = true): Promise<SessionCredentials> => {
    logDebug('ChatLogin.login', `logging in to Matrix on ${this.serverLoginUrl}`)
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
      logDebug('ChatLogin.login', 'login successful')
      return {
        ...((await response.json()) as MatrixLoginResponse),
        fresh_login: freshLogin,
      }
    } else {
      throw new HoliError(`[ChatLogin]: request to Matrix login ended up with ${response.status} status code`)
    }
  }

  public logout = async (): Promise<void> => {
    await clearSessionCredentials()
  }

  public getSessionCredentials = async (): Promise<SessionCredentials> => {
    const sessionCredentials = await loadSessionCredentials()
    logDebug('ChatLogin.getSessionCredentials', 'loaded session credentials', sessionCredentials)
    // TODO abort/retry loging on missing access
    if (!sessionCredentials?.access_token) throw new Error('unable to restore local session credentials')

    if (sessionCredentials.fresh_login === true) {
      logDebug('ChatLogin.getSessionCredentials', 'storing fresh login = false')
      await AsyncStore.setItem(CHAT_LOCAL_STORAGE_KEY_FRESH_LOGIN, 'false')
    }

    return sessionCredentials
  }
}
