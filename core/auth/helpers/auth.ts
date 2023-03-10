// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import {
  LoginFlow,
  PerformNativeLogoutBody,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UpdateLoginFlowBody,
  UpdateSettingsFlowBody,
} from '@ory/kratos-client'
import { AxiosPromise } from 'axios'
import * as SecureStore from 'expo-secure-store'

import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'

const userSessionName = 'user_session'

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getSessionFromStorage = (): Promise<OrySessionContext | null> => {
  return SecureStore.getItemAsync(userSessionName).then((r) => (r ? JSON.parse(r) : null))
}

export const setSessionInStorage = (session: OrySessionContext): Promise<void> => {
  if (!session) {
    return removeSessionFromStorage()
  }
  return SecureStore.setItemAsync(userSessionName, JSON.stringify(session))
}

export const removeSessionFromStorage = () => {
  return SecureStore.deleteItemAsync(userSessionName)
}

// Login
export const initLoginFlow = (): AxiosPromise<LoginFlow> => {
  return newKratosSdk().createNativeLoginFlow()
}

export const submitLoginFlow = (flowId: string, payload: UpdateLoginFlowBody, sessionToken?: string) =>
  newKratosSdk().updateLoginFlow(
    { flow: flowId, xSessionToken: sessionToken, updateLoginFlowBody: payload },
    { withCredentials: false }
  )

// Logout
export const submitLogoutFlow = (payload: PerformNativeLogoutBody) => {
  return newKratosSdk().performNativeLogout({ performNativeLogoutBody: payload })
}

// Register
export const initRegistrationFlow = (): AxiosPromise<RegistrationFlow> => {
  return newKratosSdk().createNativeRegistrationFlow()
}

// Forgot Password
export const initPasswordRecoveryFlow = (): AxiosPromise<RecoveryFlow> => newKratosSdk().createNativeRecoveryFlow()

// Change Password
// https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/createNativeSettingsFlow
export const initSettingsFlow = (session: OrySessionContext): AxiosPromise<SettingsFlow> =>
  newKratosSdk().createNativeSettingsFlow({ xSessionToken: session.session_token })

export const submitSettingsFlow = (flowId: string, payload: UpdateSettingsFlowBody, sessionToken?: string) =>
  newKratosSdk().updateSettingsFlow(
    { flow: flowId, xSessionToken: sessionToken, updateSettingsFlowBody: payload },
    { withCredentials: false }
  )
