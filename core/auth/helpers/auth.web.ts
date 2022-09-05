// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import { SelfServiceLoginFlow, SelfServiceRegistrationFlow } from '@ory/kratos-client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { AxiosPromise } from 'axios'

import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'

const userSessionName = 'user_session'

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getSessionFromStorage = (): Promise<OrySessionContext | null> => {
  return AsyncStore.getItem(userSessionName).then((r) => (r ? JSON.parse(r) : null))
}

export const setSessionInStorage = (session: OrySessionContext): Promise<void> => {
  if (!session) {
    return removeSessionFromStorage()
  }

  return AsyncStore.setItem(userSessionName, JSON.stringify(session))
}

export const removeSessionFromStorage = () => {
  return AsyncStore.removeItem(userSessionName)
}

export const initLoginFlow = (): AxiosPromise<SelfServiceLoginFlow> => {
  return newKratosSdk().initializeSelfServiceLoginFlowForBrowsers(true)
}

export const submitLogoutFlow = (/*payload: SubmitSelfServiceLogoutFlowWithoutBrowserBody*/) => {
  return newKratosSdk()
    .createSelfServiceLogoutFlowUrlForBrowsers('')
    .then(({ data }) => newKratosSdk().submitSelfServiceLogoutFlow(data.logout_token))
}

export const initRegistrationFlow = (): AxiosPromise<SelfServiceRegistrationFlow> => {
  return newKratosSdk().initializeSelfServiceRegistrationFlowForBrowsers()
}
