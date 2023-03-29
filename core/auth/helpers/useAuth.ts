import { makeVar, useReactiveVar } from '@apollo/client'

import { removeSessionFromStorage, setSessionInStorage } from '@holi/core/auth/helpers/auth'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'

// "undefined" is used on init when we do not know, if user is logged in
// "null" is used when we are SURE there is no logged user
const loggedInUserIdVar = makeVar<string | null | undefined>(undefined)

// intended to be called from outside the context provider (e.g. login form)
export const setUserLoggedIn = async (session: OrySessionContext): Promise<void> => {
  console.debug('[Auth] setUserLoggedIn')
  await setSessionInStorage(session)
  loggedInUserIdVar(session.session.identity.id)
}

// intended to be called from outside the context provider (e.g. logout form)
export const setUserLoggedOut = async () => {
  console.debug('[Auth] setUserLoggedOut')
  await removeSessionFromStorage()
  loggedInUserIdVar(null)
}

export const useAuth = () => {
  const userId = useReactiveVar(loggedInUserIdVar)
  return { userId }
}
