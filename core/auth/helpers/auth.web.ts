// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  SuccessfulNativeLogin,
  UpdateLoginFlowBody,
} from '@ory/kratos-client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { AxiosPromise, AxiosResponse } from 'axios'
import cookieCutter from 'cookie-cutter'

import { extractValue } from '@holi/core/auth/helpers/helper'
import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'

const userSessionName = 'user_session'

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getSessionFromStorage = (): Promise<OrySessionContext | null> => {
  return AsyncStore.getItem(userSessionName).then((r) => (r ? JSON.parse(r) : createAndStoreSessionFromCookie()))
}

const createAndStoreSessionFromCookie = async (): Promise<OrySessionContext | null> => {
  const xSessionToken = cookieCutter.get('ory_kratos_session')?.toString()
  console.log('>>>>>>>> COOKIE <<<<<<<<' + xSessionToken)
  if (!xSessionToken) {
    return null
  }
  return newKratosSdk()
    .toSession({ xSessionToken })
    .then(async ({ data: session }) => {
      console.log('>>>>>>>>>>>> SESSION <<<<<<<<<', session)
      const sessionContext = { session_token: xSessionToken, session }
      await setSessionInStorage(sessionContext)
      return sessionContext
    })
    .catch((error) => {
      console.error('Could not get session from cookie', error)
      return null
    })
}

export const setSessionInStorage = (session: OrySessionContext): Promise<void> => {
  if (!session) {
    return removeSessionFromStorage()
  }

  return AsyncStore.setItem(userSessionName, JSON.stringify(session))
}

export const removeSessionFromStorage = (): Promise<void> => {
  return AsyncStore.removeItem(userSessionName)
}

// Login
export const initLoginFlow = (): AxiosPromise<LoginFlow> => {
  return newKratosSdk().createBrowserLoginFlow({ refresh: true })
}

export const submitLoginFlow = (flow: LoginFlow, payload: UpdateLoginFlowBody): AxiosPromise<SuccessfulNativeLogin> =>
  newKratosSdk().updateLoginFlow({ flow: flow.id, updateLoginFlowBody: payload }, { withCredentials: true })

// Re-Auth
export const initReauthFlow = (): AxiosPromise<LoginFlow> => {
  return newKratosSdk().createBrowserLoginFlow({ refresh: true })
}

export const submitReauthFlow = (flow: LoginFlow, password: string): AxiosPromise<SuccessfulNativeLogin> => {
  const identifier = extractValue(flow, 'identifier')
  const csrf_token = extractValue(flow, 'csrf_token')
  return newKratosSdk().updateLoginFlow(
    {
      flow: flow.id,
      updateLoginFlowBody: { method: 'password', identifier, password, csrf_token },
    },
    { withCredentials: true }
  )
}

// Logout
export const submitLogoutFlow = async (): Promise<AxiosResponse<void>> => {
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

export const submitSettingsFlow = (flow: SettingsFlow, password: string): AxiosPromise<SettingsFlow> => {
  const csrf_token = extractValue(flow, 'csrf_token')
  return newKratosSdk().updateSettingsFlow(
    { flow: flow.id, updateSettingsFlowBody: { method: 'password', password, csrf_token } },
    { withCredentials: true }
  )
}
