import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

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

const loginStateVar = makeVar<LoginState>(loginStateUnknown)

export type LoginStateChangeListener = (curState: LoginState, prevState?: LoginState) => unknown

/**
 * Registers a listener on login state changes. The callback passed will be called with the previous on current login
 * state on every state change.
 *
 * Returns a function that, when called, de-registers the listener.
 */
export const listenOnLoginStateChange: (listener: LoginStateChangeListener) => () => void =
  createReactiveVarListener<LoginState>(loginStateVar)

// intended to be called from outside the context provider (e.g. login form)
export const setLoginStateLoggedIn = async (session: OrySessionContext): Promise<void> => {
  logger.debug('setLoginStateLoggedIn', 'user logged in')
  // save Ory session in AsyncStorage
  await setSessionInStorage(session)
  // fetch and save Okuna user
  if (session.session.identity) {
    loginStateVar(loginStateLoggedIn(session.session.identity!.id)) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  } else {
    console.error('setLoginStateLoggedIn: session.session.identity is null') // eslint-disable-line no-console
    loginStateVar(loginStateLoggedIn(''))
  }
}

// intended to be called from outside the context provider (e.g. logout form)
export const setLoginStateLoggedOut = async () => {
  logger.debug('setLoginStateLoggedOut', 'user logged out')
  loginStateVar(loginStateLoggedOut)
  await removeSessionFromStorage()
}

/**
 * React hook to retrieve and reactively subscribe to login state changes.
 *
 * Use `useLoggedInUser` for a SSR compatible variant that takes the cache into consideration.
 *
 * Use `listenOnLoginStateChange` instead if you want to subscribe a listener that receives previous and current state (e.g. in order to derive state transitions).
 *
 * Use `loginState` instead if you only want to retrieve the current login state without (reactive) subscription.
 */
export const useLoginState = (): LoginState => {
  return useReactiveVar(loginStateVar)
}

/**
 * Function to retrieve the current login state.
 *
 * If you want to reactively subscribe to login state changes from within a component, use either the `useLoggedInUser` hook to take SSR into consideration, or `useLoginState` if SSR is of no importance.
 *
 * Use `listenOnLoginStateChange` instead if you want to subscribe a listener that receives previous and current state (e.g. in order to derive state transitions).
 */
export const loginState = (): LoginState => loginStateVar()

export const exportedForTesting = {
  resetLoggedInUserIdVar: () => loginStateVar(loginStateUnknown),
}
