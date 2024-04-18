import { makeVar, useReactiveVar } from '@apollo/client'

import { ensureChatLoggedOut } from '@holi/chat/src/client/chatSession'
import { removeSessionFromStorage, setSessionInStorage } from '@holi/core/auth/helpers/auth'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('Auth')

// "undefined" is used on init when we do not know if user is logged in
// "null" is used when we are SURE there is no logged user
const loggedInUserIdVar = makeVar<string | null | undefined>(undefined)

// intended to be called from outside the context provider (e.g. login form)
export const setUserLoggedIn = async (session: OrySessionContext): Promise<void> => {
  logger.debug('setUserLogged', 'user logged in')
  // save Ory session in AsyncStorage
  await setSessionInStorage(session)
  // fetch and save Okuna user
  loggedInUserIdVar(session.session.identity.id)
}

// intended to be called from outside the context provider (e.g. logout form)
export const setUserLoggedOut = async () => {
  logger.debug('auth', 'setUserLoggedOut')
  await removeSessionFromStorage()
  await ensureChatLoggedOut()
  loggedInUserIdVar(null)
}

export const useAuth = () => {
  const userId = useReactiveVar(loggedInUserIdVar)
  return {
    userId,
    isLoggedIn: !!userId,
    isLoggedOut: userId === null,
    isUninitialized: userId === undefined,
  }
}
