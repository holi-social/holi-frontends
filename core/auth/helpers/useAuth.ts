import { makeVar, useReactiveVar } from '@apollo/client'

import { ensureChatLoggedOut } from '@holi/chat/src/client/chatSession'
import { removeSessionFromStorage, setSessionInStorage } from '@holi/core/auth/helpers/auth'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { getLogger } from '@holi/core/helpers/logging'
import * as TrackingInitializer from '@holi/core/tracking/TrackingInitializer'

const logger = getLogger('Auth')

export interface LoginStateUnknown {
  loginState: 'unknown'
  isUnknown: true
  isLoggedOut: false
  isLoggedIn: false
}

export interface LoginStateLoggedOut {
  loginState: 'loggedOut'
  isUnknown: false
  isLoggedOut: true
  isLoggedIn: false
}

export interface LoginStateLoggedIn {
  loginState: 'loggedIn'
  isUnknown: false
  isLoggedOut: false
  isLoggedIn: true
  userId: string
}

export type LoginState = LoginStateUnknown | LoginStateLoggedOut | LoginStateLoggedIn

export const loginStateUnknown: LoginStateUnknown = {
  loginState: 'unknown',
  isUnknown: true,
  isLoggedOut: false,
  isLoggedIn: false,
}

export const loginStateLoggedOut: LoginStateLoggedOut = {
  loginState: 'loggedOut',
  isUnknown: false,
  isLoggedOut: true,
  isLoggedIn: false,
}

export const loginStateLoggedIn = (userId: string): LoginStateLoggedIn => ({
  loginState: 'loggedIn',
  isUnknown: false,
  isLoggedOut: false,
  isLoggedIn: true,
  userId: userId,
})

const loggedInUserIdVar = makeVar<LoginState>(loginStateUnknown)

// intended to be called from outside the context provider (e.g. login form)
export const setUserLoggedIn = async (session: OrySessionContext): Promise<void> => {
  logger.debug('setUserLogged', 'user logged in')
  // save Ory session in AsyncStorage
  await setSessionInStorage(session)
  TrackingInitializer.userLoginStateChanged()
  // fetch and save Okuna user
  loggedInUserIdVar(loginStateLoggedIn(session.session.identity.id))
}

// intended to be called from outside the context provider (e.g. logout form)
export const setUserLoggedOut = async () => {
  logger.debug('auth', 'setUserLoggedOut')
  await removeSessionFromStorage()
  await ensureChatLoggedOut()
  TrackingInitializer.userLoginStateChanged()
  loggedInUserIdVar(loginStateLoggedOut)
}

export const useAuth = (): LoginState => {
  return useReactiveVar(loggedInUserIdVar)
}
