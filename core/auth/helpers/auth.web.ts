// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import {
  SelfServiceLoginFlow,
  SelfServiceRegistrationFlow,
  SubmitSelfServiceLogoutFlowWithoutBrowserBody,
} from '@ory/kratos-client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { AxiosPromise } from 'axios'
import getConfig from 'next/config'

import { SessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'

const { publicRuntimeConfig } = getConfig()

export const kratosUrl = publicRuntimeConfig.kratos.url

const userSessionName = 'user_session'

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

  const p = AsyncStore.getItem(userSessionName)
  return p.then(parse)
}

export const setAuthenticatedSession = (session: SessionContext): Promise<void> => {
  if (!session) {
    return killAuthenticatedSession()
  }

  return AsyncStore.setItem(userSessionName, JSON.stringify(session))
}

export const killAuthenticatedSession = () => {
  return AsyncStore.removeItem(userSessionName)
}

export const initLoginFlow = (): AxiosPromise<SelfServiceLoginFlow> => {
  return newKratosSdk().initializeSelfServiceLoginFlowForBrowsers()
}

export const submitLogoutFlow = (payload: SubmitSelfServiceLogoutFlowWithoutBrowserBody) => {
  return newKratosSdk()
    .createSelfServiceLogoutFlowUrlForBrowsers('')
    .then(({ data }) => {
      return newKratosSdk().submitSelfServiceLogoutFlow(data.logout_token)
    })
}

export const initRegistrationFlow = (): AxiosPromise<SelfServiceRegistrationFlow> => {
  return newKratosSdk().initializeSelfServiceRegistrationFlowForBrowsers()
}
