// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/AuthProvider.tsx
import { AxiosError } from 'axios'
import React, { createContext, useEffect, useState } from 'react'

import { getAuthenticatedSession, removeSessionFromStore, setSessionInStore } from './helpers/auth'
import { SessionContext, newKratosSdk } from './helpers/sdk'

interface Context {
  username: string | undefined
  isAuthenticated: boolean
  setSession: (session: SessionContext) => void
}

export const AuthContext = createContext<Context>({
  username: undefined,
  isAuthenticated: false,
  setSession: () => undefined,
})

export const AuthContextProvider: React.FC = ({ children }) => {
  const [sessionContext, setSessionContext] = useState<SessionContext | undefined>(undefined)

  const setAuth = (session?: SessionContext): Promise<void> => {
    if (!session) {
      return removeSessionFromStore().then(() => setSessionContext(undefined))
    }
    return setSessionInStore(session).then(() => syncSession(session))
  }

  const syncSession = (auth: SessionContext | null): Promise<void> => {
    if (!auth) {
      return setAuth(null)
    }
    // Use the session token from the auth session:
    return newKratosSdk()
      .toSession(auth.session_token)
      .then(({ data: session }) => {
        if (session.active) {
          console.info('[AuthProvider.tsx] session still active')
          setSessionContext({ session, session_token: auth.session_token })
          return Promise.resolve()
        } else {
          console.info('[AuthProvider.tsx] session expired')
          return setAuth(null)
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          // The user is no longer logged in (hence 401)
          console.info('[AuthProvider.tsx] session is not authenticated:', err)
          //navigate('/login')
        }
        // Remove the session / log the user out.
        return setAuth(null).then(() => setSessionContext(null))
      })
  }

  // Fetches the authentication session.
  useEffect(() => {
    getAuthenticatedSession().then(syncSession)
  }, [])

  if (sessionContext === undefined) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        username: sessionContext?.session.identity.traits.email,
        isAuthenticated: Boolean(sessionContext?.session),
        setSession: setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
