import { makeVar, useReactiveVar } from '@apollo/client'

import type { ChatSessionHandler } from '@holi/chat/src/store'
import { removeSessionFromStorage, setSessionInStorage } from '@holi/core/auth/helpers/auth'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { IS_CHAT_ENABLED } from '@holi/core/screens/chat/tempConsts'

// "undefined" is used on init when we do not know, if user is logged in
// "null" is used when we are SURE there is no logged user
const loggedInUserIdVar = makeVar<string | null | undefined>(undefined)

// intended to be called from outside the context provider (e.g. login form)
export const setUserLoggedIn = async (
  session: OrySessionContext,
  chatSessionHandler: ChatSessionHandler,
  freshLogin = true
): Promise<void> => {
  console.debug('[Auth] setUserLoggedIn')
  // save Ory session in AsyncStorage
  await setSessionInStorage(session)
  // fetch and save Okuna user
  loggedInUserIdVar(session.session.identity.id)
  // fetch and save Matrix session in AsyncStorage
  if (IS_CHAT_ENABLED) {
    // TODO: handle loading animation
    await chatSessionHandler('start', session?.session_token, freshLogin)
  }
}

// intended to be called from outside the context provider (e.g. logout form)
export const setUserLoggedOut = async (chatSessionHandler: ChatSessionHandler) => {
  console.debug('[Auth] setUserLoggedOut')
  await removeSessionFromStorage()
  loggedInUserIdVar(null)

  if (IS_CHAT_ENABLED) {
    await chatSessionHandler('end')
  }
}

export const useAuth = () => {
  const userId = useReactiveVar(loggedInUserIdVar)
  return { userId }
}
