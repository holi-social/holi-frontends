// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UpdateLoginFlowBody,
  UpdateSettingsFlowBody,
} from '@ory/kratos-client'
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

// Login
export const initLoginFlow = (): AxiosPromise<LoginFlow> => {
  return newKratosSdk().createBrowserLoginFlow({ refresh: true })
}

export const submitLoginFlow = (flowId: string, payload: UpdateLoginFlowBody, sessionToken?: string) =>
  newKratosSdk().updateLoginFlow(
    { flow: flowId, xSessionToken: sessionToken, updateLoginFlowBody: payload },
    { withCredentials: true }
  )

// Logout
export const submitLogoutFlow = async () => {
  const { data } = await newKratosSdk().createBrowserLogoutFlow()
  return await newKratosSdk().updateLogoutFlow({ token: data.logout_token })
}

// Registration
export const initRegistrationFlow = (): AxiosPromise<RegistrationFlow> => {
  return newKratosSdk().createBrowserRegistrationFlow()
}

// Forgot Password
export const initPasswordRecoveryFlow = (): AxiosPromise<RecoveryFlow> => newKratosSdk().createBrowserRecoveryFlow()

// Change Password
// https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/createNativeSettingsFlow
export const initSettingsFlow = (): AxiosPromise<SettingsFlow> => newKratosSdk().createBrowserSettingsFlow()

export const submitSettingsFlow = (flowId: string, payload: UpdateSettingsFlowBody, sessionToken?: string) =>
  newKratosSdk().updateSettingsFlow(
    { flow: flowId, xSessionToken: sessionToken, updateSettingsFlowBody: payload },
    { withCredentials: true }
  )
