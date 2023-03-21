// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import {
  LoginFlow,
  PerformNativeLogoutBody,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  SuccessfulNativeLogin,
  UpdateLoginFlowBody,
} from '@ory/kratos-client'
import { AxiosPromise, AxiosResponse } from 'axios'
import * as SecureStore from 'expo-secure-store'

import { extractValue } from '@holi/core/auth/helpers/helper'
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

export const removeSessionFromStorage = (): Promise<void> => {
  return SecureStore.deleteItemAsync(userSessionName)
}

// Login
export const initLoginFlow = (): AxiosPromise<LoginFlow> => {
  return newKratosSdk().createNativeLoginFlow()
}

export const submitLoginFlow = (
  flow: LoginFlow,
  payload: UpdateLoginFlowBody,
  sessionToken?: string
): AxiosPromise<SuccessfulNativeLogin> =>
  newKratosSdk().updateLoginFlow(
    { flow: flow.id, xSessionToken: sessionToken, updateLoginFlowBody: payload },
    { withCredentials: false }
  )

// Logout
export const submitLogoutFlow = (payload: PerformNativeLogoutBody): Promise<AxiosResponse<void>> => {
  return newKratosSdk().performNativeLogout({ performNativeLogoutBody: payload })
}

// Re-Auth
export const initReauthFlow = (sessionToken?: string): AxiosPromise<LoginFlow> => {
  return newKratosSdk().createNativeLoginFlow({ refresh: true, xSessionToken: sessionToken })
}

export const submitReauthFlow = (
  flow: LoginFlow,
  password: string,
  sessionToken?: string
): AxiosPromise<SuccessfulNativeLogin> => {
  const identifier = extractValue(flow, 'identifier')
  return newKratosSdk().updateLoginFlow(
    { flow: flow.id, updateLoginFlowBody: { method: 'password', identifier, password }, xSessionToken: sessionToken },
    { withCredentials: true }
  )
}

// Register
export const initRegistrationFlow = (): AxiosPromise<RegistrationFlow> => {
  return newKratosSdk().createNativeRegistrationFlow()
}

// Forgot Password
export const initPasswordRecoveryFlow = (): AxiosPromise<RecoveryFlow> => newKratosSdk().createNativeRecoveryFlow()

// Change Password
// https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/createNativeSettingsFlow
export const initSettingsFlow = (sessionToken?: string): AxiosPromise<SettingsFlow> =>
  newKratosSdk().createNativeSettingsFlow({ xSessionToken: sessionToken })

export const submitSettingsFlow = (
  flow: SettingsFlow,
  password: string,
  sessionToken?: string
): AxiosPromise<SettingsFlow> =>
  newKratosSdk().updateSettingsFlow(
    { flow: flow.id, xSessionToken: sessionToken, updateSettingsFlowBody: { method: 'password', password } },
    { withCredentials: false }
  )
