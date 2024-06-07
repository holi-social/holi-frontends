import { makeVar, useReactiveVar } from '@apollo/client'

import { removeSessionFromStorage, setSessionInStorage } from '@holi/core/auth/helpers/auth/helpers'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { createReactiveVarListener } from '@holi/core/helpers/createReactiveVarListener'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('Auth')

export interface LoginStateUnknown {
  isUnknown: true
  isLoggedOut: false
  isLoggedIn: false
}

export interface LoginStateLoggedOut {
  isUnknown: false
  isLoggedOut: true
  isLoggedIn: false
}

export interface LoginStateLoggedIn {
  isUnknown: false
  isLoggedOut: false
  isLoggedIn: true
  userId: string
}

export type LoginState = LoginStateUnknown | LoginStateLoggedOut | LoginStateLoggedIn

export const loginStateUnknown: LoginStateUnknown = {
  isUnknown: true,
  isLoggedOut: false,
  isLoggedIn: false,
}

export const loginStateLoggedOut: LoginStateLoggedOut = {
  isUnknown: false,
  isLoggedOut: true,
  isLoggedIn: false,
}

export const loginStateLoggedIn = (userId: string): LoginStateLoggedIn => ({
  isUnknown: false,
  isLoggedOut: false,
  isLoggedIn: true,
  userId: userId,
})

const loggedInUserIdVar = makeVar<LoginState>(loginStateUnknown)

export type LoginStateChangeListener = (curState: LoginState, prevState?: LoginState) => unknown

/**
 * Registers a listener on login state changes. The callback passed will be called with the previous on current login
 * state on every state change.
 *
 * Returns a function that, when called, de-registers the listener.
 */
export const listenOnLoginStateChange: (listener: LoginStateChangeListener) => () => void =
  createReactiveVarListener<LoginState>(loggedInUserIdVar)

// intended to be called from outside the context provider (e.g. login form)
export const setUserLoggedIn = async (session: OrySessionContext): Promise<void> => {
  logger.debug('setUserLoggedIn', 'user logged in')
  // save Ory session in AsyncStorage
  await setSessionInStorage(session)
  // fetch and save Okuna user
  loggedInUserIdVar(loginStateLoggedIn(session.session.identity.id))
}

// intended to be called from outside the context provider (e.g. logout form)
export const setUserLoggedOut = async () => {
  logger.debug('setUserLoggedOut', 'user logged out')
  await removeSessionFromStorage()
  loggedInUserIdVar(loginStateLoggedOut)
}

export const useAuth = (): LoginState => {
  return useReactiveVar(loggedInUserIdVar)
}

export const useAuthExportedForTesting = {
  resetLoggedInUserIdVar: () => loggedInUserIdVar(loginStateUnknown),
}
