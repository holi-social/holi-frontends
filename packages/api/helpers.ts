import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'

export interface AuthorizationHeaders {
  Authorization?: string
  'X-Session-Token'?: string
}

export const createAuthorizationHeaders = async (): Promise<AuthorizationHeaders> => {
  // get the authentication token from local storage if it exists
  const sessionToken = await getSessionFromStorage().then((s) => s?.session_token)
  if (!sessionToken) {
    return {}
  }
  return {
    Authorization: 'Bearer ' + sessionToken,
    'X-Session-Token': sessionToken,
  }
}
