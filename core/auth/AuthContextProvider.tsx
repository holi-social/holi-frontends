// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/AuthProvider.tsx
import React, { createContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { displayError } from '@holi/core/errors/helpers'

import { getSessionFromStorage, removeSessionFromStorage, setSessionInStorage } from './helpers/auth'
import { OrySessionContext, OrySessionToken, newKratosSdk } from './helpers/sdk'

export interface Context {
  isLoading: boolean
  isLoggedIn: boolean
  setUserLoggedIn: (session: OrySessionContext) => Promise<void>
  setUserLoggedOut: () => Promise<void>
}

const initialContext: Context = {
  isLoading: true,
  isLoggedIn: false,
  setUserLoggedIn: () => Promise.resolve(),
  setUserLoggedOut: () => Promise.resolve(),
}

export const AuthContext = createContext<Context>(initialContext)

type SessionState = 'active' | 'expired' | 'invalid'

type AuthContextInternalState = {
  isLoading: boolean
  isLoggedIn: boolean
}

const kratosSdk = newKratosSdk()

const AuthContextProvider: React.FC = ({ children }) => {
  // keep isLoading and isLoggedIn together so they can be atomically updated
  // this should result in only required redraws of child components
  const [state, setState] = useState<AuthContextInternalState>({ isLoading: true, isLoggedIn: false })
  const { t } = useTranslation()

  // intended to be called from outside the context provider (e.g. login form)
  const setUserLoggedIn = (session: OrySessionContext): Promise<void> => {
    console.debug('[AuthContextProvider] setUserLoggedIn')
    return setSessionInStorage(session).then(() =>
      setState({
        isLoading: false,
        isLoggedIn: true,
      })
    )
  }

  // intended to be called from outside the context provider (e.g. logout form)
  const setUserLoggedOut = (): Promise<void> => {
    console.debug('[AuthContextProvider] setUserLoggedOut')
    return removeSessionFromStorage().then(() =>
      setState({
        isLoading: false,
        isLoggedIn: false,
      })
    )
  }

  const validateSessionWithOry = (orySessionToken: OrySessionToken): Promise<SessionState> => {
    return (
      kratosSdk
        // sends GET request to Ory Clouds `/whoami` endpoint, returning the session belonging to the session_token
        .toSession(orySessionToken)
        .then(({ data: session }) => (session.active ? 'active' : 'expired'))
        .catch((/*e: AxiosError*/) => 'invalid')
    )
  }

  const onSessionLoadedFromStorage = (sessionFromStorage: OrySessionContext | null): Promise<void> => {
    if (sessionFromStorage === null) {
      console.debug('[AuthContextProvider] no session found in storage')
      setState({
        isLoading: false,
        isLoggedIn: false,
      })
      return Promise.resolve()
    } else {
      return validateSessionWithOry(sessionFromStorage.session_token)
        .then((sessionState) => {
          console.debug(`[AuthContextProvider] ${sessionState} session found in storage`)
          switch (sessionState) {
            case 'active':
              setState({
                isLoading: false,
                isLoggedIn: true,
              })
              return Promise.resolve()
            case 'expired':
              return removeSessionFromStorage().then(() =>
                setState({
                  isLoading: false,
                  isLoggedIn: false,
                })
              )
            case 'invalid':
              return removeSessionFromStorage().then(() =>
                setState({
                  isLoading: false,
                  isLoggedIn: false,
                })
              )
          }
        })
        .catch((e) => {
          setState({
            isLoading: false,
            isLoggedIn: false,
          })
          throw e
        })
    }
  }

  // Fetches the authentication session.
  useEffect(() => {
    getSessionFromStorage()
      .then(onSessionLoadedFromStorage)
      .catch((error) => displayError(error, t('auth.authContextProvider.error.sessionCreation')))
    // eslint-disable-next-line
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoading: state.isLoading,
        isLoggedIn: state.isLoggedIn,
        setUserLoggedIn: setUserLoggedIn,
        setUserLoggedOut: setUserLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
