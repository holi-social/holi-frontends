// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import { SelfServiceRegistrationFlow, Session as KratosSession } from '@ory/kratos-client'
import * as SecureStore from 'expo-secure-store'
import { AxiosPromise } from 'axios'
import { SelfServiceLoginFlow } from '@ory/kratos-client'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { SubmitSelfServiceLogoutFlowWithoutBrowserBody } from '@ory/kratos-client'

const userSessionName = 'user_session'

export type SessionContext = {
  session_token: string

  session: KratosSession
} | null

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getAuthenticatedSession = (): Promise<SessionContext> => {
  const parse = (sessionRaw: string | null): SessionContext => {
    if (!sessionRaw) {
      return null
    }

    return JSON.parse(sessionRaw)
  }
  const p = SecureStore.getItemAsync(userSessionName)
  return p.then(parse)
}

export const setAuthenticatedSession = (session: SessionContext): Promise<void> => {
  if (!session) {
    return killAuthenticatedSession()
  }
  return SecureStore.setItemAsync(userSessionName, JSON.stringify(session))
}

export const killAuthenticatedSession = () => {
  return SecureStore.deleteItemAsync(userSessionName)
}

export const initLoginFlow = (): AxiosPromise<SelfServiceLoginFlow> => {
  return newKratosSdk().initializeSelfServiceLoginFlowWithoutBrowser()
}

export const submitLogoutFlow = (payload: SubmitSelfServiceLogoutFlowWithoutBrowserBody) => {
  return newKratosSdk().submitSelfServiceLogoutFlowWithoutBrowser(payload)
}

export const initRegistrationFlow = (): AxiosPromise<SelfServiceRegistrationFlow> => {
  return newKratosSdk().initializeSelfServiceRegistrationFlowWithoutBrowser()
}
