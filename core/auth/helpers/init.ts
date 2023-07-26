import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import { OrySessionContext, OrySessionToken, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setUserLoggedIn, setUserLoggedOut } from '@holi/core/auth/helpers/useAuth'

const kratosSdk = newKratosSdk()

type SessionState = 'active' | 'expired' | 'invalid'

export const validateSessionWithOry = async (orySessionToken: OrySessionToken): Promise<SessionState> => {
  // sends GET request to Ory Clouds `/whoami` endpoint, returning the session belonging to the session_token
  try {
    const { data: session } = await kratosSdk.toSession({ xSessionToken: orySessionToken })
    return session.active ? 'active' : 'expired'
  } catch (_) {
    return 'invalid'
  }
}

export const onSessionLoadedFromStorage = async (sessionFromStorage: OrySessionContext | null) => {
  if (sessionFromStorage === null) {
    console.debug('[Auth] no session found in storage')
    await setUserLoggedOut()
  } else {
    try {
      const sessionState = await validateSessionWithOry(sessionFromStorage.session_token)

      switch (sessionState) {
        case 'active':
          await setUserLoggedIn(sessionFromStorage, false)
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
