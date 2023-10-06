import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import { OrySessionContext, OrySessionToken, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setUserLoggedIn, setUserLoggedOut } from '@holi/core/auth/helpers/useAuth'
import { logDebug } from '@holi/core/helpers/logging'

const kratosSdk = newKratosSdk()

type SessionState = 'active' | 'expired' | 'invalid'

// sends GET request to Ory Clouds `/whoami` endpoint, returning the session belonging to the session_token (native clients) resp. cookie (web, automatically sent)
export const validateSessionWithOry = async (orySessionToken?: OrySessionToken): Promise<SessionState> =>
  kratosSdk
    .toSession({ xSessionToken: orySessionToken })
    .then(({ data }) => (data?.active ? 'active' : 'expired'))
    .catch(() => 'invalid')

export const onSessionLoadedFromStorage = async (sessionFromStorage: OrySessionContext | null) => {
  if (sessionFromStorage === null) {
    logDebug('auth', 'no session found in storage')
    await setUserLoggedOut()
  } else {
    try {
      const sessionState = await validateSessionWithOry(sessionFromStorage.session_token)

      switch (sessionState) {
        case 'active':
          await setUserLoggedIn(sessionFromStorage)
          break
        case 'expired':
        case 'invalid':
        default:
          await setUserLoggedOut()
      }
    } catch (err) {
      await setUserLoggedOut()
      throw err
    }
  }
}

// Fetches the authentication session.
export const initAuth = async () => {
  const session = await getSessionFromStorage()
  await onSessionLoadedFromStorage(session)
}
