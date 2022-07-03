// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/AuthProvider.tsx
import { AxiosError } from 'axios'
import React, { createContext, useEffect, useState } from 'react'

import useErrorHandling from '@holi/core/errors/useErrorHandling'

import { getSessionFromStorage, removeSessionFromStorage, setSessionInStorage } from './helpers/auth'
import { OrySessionContext, OrySessionToken, newKratosSdk } from './helpers/sdk'

export interface Context {
  isAuthenticated: boolean
  setUserLoggedIn: (session: OrySessionContext) => Promise<void>
  setUserLoggedOut: () => Promise<void>
}

export const AuthContext = createContext<Context>({
  isAuthenticated: false,
  setUserLoggedIn: () => Promise.resolve(),
  setUserLoggedOut: () => Promise.resolve(),
})

type SessionState = 'active' | 'expired' | 'invalid'

const kratosSdk = newKratosSdk()

export const AuthContextProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const { displayError } = useErrorHandling()

  const validateSessionWithOry = (orySessionToken: OrySessionToken): Promise<SessionState> => {
    return (
      kratosSdk
        // sends GET request to Ory Clouds `/whoami` endpoint, returning the session belonging to the session_token
        .toSession(orySessionToken)
        .then(({ data: session }) => (session.active ? 'active' : 'expired'))
        .catch((e: AxiosError) => 'invalid')
    )
  }

  const onSessionLoadedFromStorage = (sessionFromStorage: OrySessionContext | null): Promise<void> => {
    if (sessionFromStorage === null) {
      console.debug('[AuthProvider] no session found in storage')
      return removeSessionFromStorage().then(() => setIsLoggedIn(false))
    } else {
      return validateSessionWithOry(sessionFromStorage.session_token).then((sessionState) => {
        switch (sessionState) {
          case 'active':
            console.debug('[AuthProvider] active session found in storage')
            setIsLoggedIn(true)
            return Promise.resolve()
          case 'expired':
            console.debug('[AuthProvider] expired session found in storage')
            return removeSessionFromStorage().then(() => setIsLoggedIn(false))
          case 'invalid':
            console.debug('[AuthProvider] invalid session found in storage')
            return removeSessionFromStorage().then(() => setIsLoggedIn(false))
        }
      })
    }
  }

  // Fetches the authentication session.
  useEffect(() => {
    getSessionFromStorage()
      .then(onSessionLoadedFromStorage)
      .catch((error) => displayError(error, 'Error creating session'))
  }, [])

  // intended to be called from outside the context provider (e.g. login form)
  const setUserLoggedIn = (session: OrySessionContext): Promise<void> => {
    console.debug('[AuthProvider] setUserLoggedIn')
    return setSessionInStorage(session).then(() => setIsLoggedIn(true))
  }

  // intended to be called from outside the context provider (e.g. logout form)
  const setUserLoggedOut = (): Promise<void> => {
    console.debug('[AuthProvider] setUserLoggedOut')
    return removeSessionFromStorage().then(() => setIsLoggedIn(false))
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isLoggedIn,
        setUserLoggedIn,
        setUserLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
