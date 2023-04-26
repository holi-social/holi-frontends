// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  SuccessfulNativeLogin,
  UpdateLoginFlowBody,
  VerificationFlow,
} from '@ory/kratos-client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { AxiosPromise, AxiosResponse } from 'axios'

import { extractValue } from '@holi/core/auth/helpers/helper'
import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'

const userSessionName = 'user_session'

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getSessionFromStorage = async () => {
  if (typeof window !== 'undefined') {
    try {
      const resp = await AsyncStore.getItem(userSessionName)
      return resp ? (JSON.parse(resp) as OrySessionContext) : null
    } catch (_) {
      return null
    }
  }

  return null
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

const initVerificationFlow = async () => newKratosSdk().createBrowserVerificationFlow()

const getVerificationFlow = async (flowId: string) => newKratosSdk().getVerificationFlow({ id: flowId })

export const getOrCreateVerificationFlow = async ({ id, email }: { id?: string; email?: string } = {}) => {
  if (id) {
    const { data } = await getVerificationFlow(id)
    return data
  } else if (email) {
    return resendVerificationEmail(email)
  }
}

export const resendVerificationEmail = async (email: string) => {
  const flow = await initVerificationFlow()
  return submitVerificationFlow({ flow: flow.data, email })
}

export const submitExistingVerificationFlow = async (flowId: string, code: string) => {
  const flow = await getVerificationFlow(flowId)
  return submitVerificationFlow({ flow: flow.data, code })
}

export const submitVerificationFlow = async ({
  flow,
  code = '',
  email = '',
}: {
  flow: VerificationFlow
  code?: string
  email?: string
}) => {
  const csrf_token = extractValue(flow, 'csrf_token')
  const newFlow = await newKratosSdk().updateVerificationFlow({
    flow: flow.id,
    token: code,
    updateVerificationFlowBody: {
      method: 'code',
      csrf_token,
      email,
      code,
    },
  })
  return newFlow.data
}
