// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import {
  LoginFlow,
  PerformNativeLogoutBody,
  SettingsFlow,
  UpdateLoginFlowBody,
  UpdateLoginFlowWithPasswordMethod,
  VerificationFlow,
} from '@ory/kratos-client'
import * as SecureStore from 'expo-secure-store'

import { extractValue } from '@holi/core/auth/helpers/helper'
import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { VerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'

const userSessionName = 'user_session'

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getSessionFromStorage = async () => {
  try {
    const session = await SecureStore.getItemAsync(userSessionName)
    return session ? (JSON.parse(session) as OrySessionContext) : null
  } catch (err) {
    return null
  }
}

export const setSessionInStorage = async (session: OrySessionContext) => {
  if (!session) {
    await removeSessionFromStorage()
  } else {
    await SecureStore.setItemAsync(userSessionName, JSON.stringify(session))
  }
}

export const removeSessionFromStorage = () => SecureStore.deleteItemAsync(userSessionName)

// Login
export const hasIdentifier = (
  loginFlowBody: UpdateLoginFlowBody | VerificationFlowData
): loginFlowBody is UpdateLoginFlowWithPasswordMethod => {
  return 'identifier' in loginFlowBody
}

export const initLoginFlow = async () => {
  const { data } = await newKratosSdk().createNativeLoginFlow()
  return data
}

export const submitLoginFlow = async (flow: LoginFlow, payload: UpdateLoginFlowBody, sessionToken?: string) =>
  newKratosSdk().updateLoginFlow(
    { flow: flow.id, xSessionToken: sessionToken, updateLoginFlowBody: payload },
    { withCredentials: false }
  )

interface LoginOptions {
  payload: UpdateLoginFlowWithPasswordMethod
  flow?: LoginFlow
  memoized?: boolean
  onLoginError?: (error: unknown) => void
  onLoginFlowError?: (error: unknown) => void
}

export const login = async ({
  flow,
  payload,
  // default behaviour for Error callbacks to rethrow the error
  onLoginError = (err) => {
    throw err
  },
  onLoginFlowError = (err) => {
    throw err
  },
}: LoginOptions) => {
  try {
    flow ??= await initLoginFlow()

    try {
      const { data } = await submitLoginFlow(flow, payload, undefined)
      return data
    } catch (error) {
      onLoginFlowError(error)
    }
  } catch (error) {
    onLoginError(error)
  }
}

// Logout
export const submitLogoutFlow = async (payload: PerformNativeLogoutBody) => {
  if (payload.session_token) newKratosSdk().performNativeLogout({ performNativeLogoutBody: payload })
}

// Re-Auth
export const initReauthFlow = async (sessionToken?: string) =>
  newKratosSdk().createNativeLoginFlow({ refresh: true, xSessionToken: sessionToken })

export const submitReauthFlow = async (flow: LoginFlow, password: string, sessionToken?: string) => {
  const identifier = extractValue(flow, 'identifier')
  return newKratosSdk().updateLoginFlow(
    { flow: flow.id, updateLoginFlowBody: { method: 'password', identifier, password }, xSessionToken: sessionToken },
    { withCredentials: true }
  )
}

// Register
export const initRegistrationFlow = async () => newKratosSdk().createNativeRegistrationFlow()

// Forgot Password
export const initPasswordRecoveryFlow = async () => newKratosSdk().createNativeRecoveryFlow()

// Change Password
// https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/createNativeSettingsFlow
export const initSettingsFlow = async (sessionToken?: string) =>
  newKratosSdk().createNativeSettingsFlow({ xSessionToken: sessionToken })

export const submitSettingsFlow = async (flow: SettingsFlow, password: string, sessionToken?: string) =>
  newKratosSdk().updateSettingsFlow(
    { flow: flow.id, xSessionToken: sessionToken, updateSettingsFlowBody: { method: 'password', password } },
    { withCredentials: false }
  )

// Email verification flow
const initVerificationFlow = async () => newKratosSdk().createNativeVerificationFlow()

export const getVerificationFlow = async (flowId: string) => newKratosSdk().getVerificationFlow({ id: flowId })

export const getOrCreateVerificationFlow = async (flowData?: VerificationFlowData) => {
  if (!flowData) throw new Error('[Onboarding] no verification flow has been found')

  if (hasIdentifier(flowData)) {
    return resendVerificationEmail(flowData.identifier)
  } else {
    const { data } = await getVerificationFlow(flowData.id)
    return data
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
  const newFlow = await newKratosSdk().updateVerificationFlow({
    flow: flow.id,
    token: code,
    updateVerificationFlowBody: {
      flow: flow.id,
      method: 'code',
      email,
      code,
    },
  })
  return newFlow.data
}
