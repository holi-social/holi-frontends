import fetch from 'cross-fetch'
// The Matrix SDK uses the TextEncoder internally.
// Unfortunately, the Hermes JS engine does not support TextEncoder or TextDecoder.
// We need this lightweight polyfill to support mobile.
import 'fast-text-encoding'
import { Platform } from 'react-native'

import type { MatrixDeviceName } from '@holi/chat/src/utils/constants'
import {
  StoredCredentials as SessionCredentials,
  clearSessionCredentials,
  loadSessionCredentials,
  storeSessionCredentials,
} from '@holi/chat/src/utils/storage'
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

// TODO the class has no state in itself, consider refactoring this as functions / static methods.
const serverLoginUrl = chatLoginUrl + '/_matrix/client/r0/login'
const deviceName: MatrixDeviceName = `holi-${Platform.OS}`
/**
 * @name ChatLogin
 * @description a disposable/temporary Matrix client necessary to log in to the
 * user for the first time on each session.
 */

export const ensureChatLoggedIn = async (orySessionToken: string, freshLogin = true): Promise<SessionCredentials> => {
  // fetch only if no Matrix session data found
  const storedSessionCredentials = await loadSessionCredentials()
  if (storedSessionCredentials?.access_token) {
    return Promise.resolve(storedSessionCredentials)
  } else {
    return await storeSessionCredentials(await login(orySessionToken, freshLogin))
  }
}

const login = async (orySessionToken: string, freshLogin = true): Promise<SessionCredentials> => {
  const response = await fetch(serverLoginUrl, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7,en-DE;q=0.6',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      ...(orySessionToken ? { authorization: `Bearer ${orySessionToken}` } : {}),
    },
    referrerPolicy: 'no-referrer',
    body: `{"type":"org.matrix.login.jwt","initial_device_display_name":"${deviceName}"}`,
    method: 'POST',
    mode: 'cors',
  })

  if (response.ok) {
    return {
      ...((await response.json()) as MatrixLoginResponse),
      fresh_login: freshLogin,
    }
  } else {
    throw new HoliError(`[ChatLogin]: request to Matrix login ended up with ${response.status} status code`)
  }
}

export const logoutChat = async (): Promise<void> => {
  await clearSessionCredentials()
}
