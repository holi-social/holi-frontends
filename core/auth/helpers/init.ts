import { getSessionFromStorage, initSocialLogin } from '@holi/core/auth/helpers/auth'
import { type OrySessionContext, type OrySessionToken, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setLoginStateLoggedIn, setLoginStateLoggedOut } from '@holi/core/auth/loginState'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('Auth')

type SessionState = 'active' | 'expired' | 'invalid'

// sends GET request to Ory Clouds `/whoami` endpoint, returning the session belonging to the session_token (native clients) resp. cookie (web, automatically sent)
export const validateSessionWithOry = async (orySessionToken?: OrySessionToken): Promise<SessionState> =>
  newKratosSdk()
    .toSession({ xSessionToken: orySessionToken })
    .then(({ data }) => (data?.active ? 'active' : 'expired'))
    .catch(() => 'invalid')

export const onSessionLoadedFromStorage = async (sessionFromStorage: OrySessionContext | null) => {
  if (sessionFromStorage === null) {
    logger.debug('auth', 'no session found in storage')
    await setLoginStateLoggedOut()
  } else {
    try {
      const sessionState = await validateSessionWithOry(sessionFromStorage.session_token)

      switch (sessionState) {
        case 'active':
          await setLoginStateLoggedIn(sessionFromStorage)
          break
        case 'expired':
        case 'invalid':
        default:
          await setLoginStateLoggedOut()
      }
    } catch (err) {
      await setLoginStateLoggedOut()
      throw err
    }
  }
}

// Fetches the authentication session.
export const initAuth = async () => {
  const session = await getSessionFromStorage()
  await onSessionLoadedFromStorage(session)
  initSocialLogin()
}
