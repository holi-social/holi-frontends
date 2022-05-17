// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/AuthProvider.tsx
import { AxiosError } from 'axios'
import React, { createContext, useEffect, useState } from 'react'

import { getAuthenticatedSession, killAuthenticatedSession, setAuthenticatedSession } from './helpers/auth'
import { SessionContext, newKratosSdk } from './helpers/sdk'

interface Context {
  username: string | undefined
  isAuthenticated: boolean
  setSession: (session: SessionContext) => void
}

export const AuthContext = createContext<Context>({
  username: undefined,
  isAuthenticated: false,
  setSession: () => {
    undefined
  },
})

export const AuthContextProvider: React.FC = ({ children }) => {
  const [sessionContext, setSessionContext] = useState<SessionContext | undefined>(undefined)

  const setAuth = (session: SessionContext) => {
    if (!session) {
      return killAuthenticatedSession().then(() => setSessionContext(session))
    }

    setAuthenticatedSession(session).then(() => syncSession(session))
  }

  const syncSession = (auth: SessionContext) => {
    if (!auth) {
      return setAuth(null)
    }
    // Use the session token from the auth session:
    return (
      newKratosSdk()
        // whoami() returns the session belonging to the session_token:
        .toSession(auth.session_token)
        .then(({ data: session }) => {
          if (session.active) {
            console.info('[AuthProvider.tsx] session still active')
            setSessionContext({ session, session_token: auth.session_token })
          } else {
            console.info('[AuthProvider.tsx] session expired')
            setAuth(null)
          }
          return Promise.resolve()
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            // The user is no longer logged in (hence 401)
            console.info('[AuthProvider.tsx] Session is not authenticated:', err)
            //navigate('/login')
          }
          // Remove the session / log the user out.
          setAuth(null)
          setSessionContext(null)
        })
    )
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
        isAuthenticated: Boolean(sessionContext?.session_token),
        setSession: setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
