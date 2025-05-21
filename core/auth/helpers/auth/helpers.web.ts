// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import type {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  SuccessfulNativeLogin,
  UiText,
  UpdateLoginFlowBody,
  UpdateRegistrationFlowBody,
  VerificationFlow,
} from '@ory/kratos-client'
import AsyncStore from '@react-native-async-storage/async-storage'
import type { AxiosPromise } from 'axios'

import { extractValue, handleKratosSdkError, handleKratosSdkErrorIgnoringCodes } from '@holi/core/auth/helpers/helper'
import { newKratosSdk, type OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { holiNextJSApiUrl } from '@holi/api/config'

const userSessionName = 'user_session'

// Only needed on mobile
export const initSocialLogin = () => {}

export const syncUserSessionFromOrySession = async () => {
  try {
    const session = await newKratosSdk().toSession()
    if (session && session.data) {
      const orySession = { session: session.data } as OrySessionContext
      await setSessionInStorage(orySession)
      return orySession
    } else {
      removeSessionFromStorage()
    }
  } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
    // we could not recover a session from Ory, so we are sure there is none
  }
  return null
}

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getSessionFromStorage = async () => {
  if (typeof window !== 'undefined') {
    try {
      const resp = await AsyncStore.getItem(userSessionName)
      if (resp) return JSON.parse(resp) as OrySessionContext
      // We don't have a session in storage, but we could still have a valid Ory session cookie, so we try to restore the session
      return await syncUserSessionFromOrySession()
    } catch (_) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
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

export const initLoginFlow = async (flowId?: string): Promise<LoginFlow> => {
  let extraMessages: UiText[] = []
  if (flowId) {
    const flow = await newKratosSdk()
      .getLoginFlow({ id: flowId })
      .then(({ data }) => {
        // Treat message "E-mail address already used by another account" as error and recreate the login flow
        const errorMessages = data?.ui?.messages?.filter((message) => message.id === 1010016)
        if (errorMessages?.length) {
          extraMessages = errorMessages
          return undefined
        }
        return data
      })
      .catch(handleKratosSdkError('getLoginFlow'))
    if (flow) {
      return flow
    }
  }
  return newKratosSdk()
    .createBrowserLoginFlow({
      refresh: true,
      returnTo: holiNextJSApiUrl,
    })
    .then(({ data }) => {
      return {
        ...data,
        ui: {
          ...data.ui,
          messages: extraMessages.concat(data.ui.messages ?? []),
        },
      }
    })
    .catch(handleKratosSdkError('createBrowserLoginFlow'))
}

// Special logic for OIDC on mobile only
export const retrieveSubmitFlowBody = async <T extends UpdateLoginFlowBody | UpdateRegistrationFlowBody>(
  payload: T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider?: string
): Promise<T> => payload

export const submitLoginFlow = (
  flow: LoginFlow,
  payload: UpdateLoginFlowBody,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sessionToken?: string
): AxiosPromise<SuccessfulNativeLogin> =>
  newKratosSdk()
    .updateLoginFlow({ flow: flow.id, updateLoginFlowBody: payload }, { withCredentials: true })
    .catch(handleKratosSdkError('updateLoginFlow'))

// This method is only called on mobile and is only here to satisfy the compiler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const doBrowserLogin = async (url: string) => {}

// Re-Auth
export const initReauthFlow = (): AxiosPromise<LoginFlow> => {
  return newKratosSdk().createBrowserLoginFlow({ refresh: true }).catch(handleKratosSdkError('initReauthFlow'))
}

export const submitReauthFlow = (flow: LoginFlow, password: string): AxiosPromise<SuccessfulNativeLogin> => {
  const identifier = extractValue(flow, 'identifier')
  const csrf_token = extractValue(flow, 'csrf_token')
  return newKratosSdk()
    .updateLoginFlow(
      {
        flow: flow.id,
        updateLoginFlowBody: { method: 'password', identifier, password, csrf_token },
      },
      { withCredentials: true }
    )
    .catch(handleKratosSdkError('submitReauthFlow'))
}

// Logout
export const submitLogoutFlow = () =>
  newKratosSdk()
    .createBrowserLogoutFlow()
    .catch(handleKratosSdkErrorIgnoringCodes('createBrowserLogoutFlow', { errorCodesToIgnore: ['session_inactive'] }))
    .then((response) => {
      const token = response?.data?.logout_token
      if (token) {
        return newKratosSdk().updateLogoutFlow({ token })
      }
    })
    .catch(handleKratosSdkErrorIgnoringCodes('updateLogoutFlow', { errorCodesToIgnore: ['session_inactive'] }))

// Registration
export const initRegistrationFlow = (): AxiosPromise<RegistrationFlow> =>
  newKratosSdk().createBrowserRegistrationFlow().catch(handleKratosSdkError('createBrowserRegistrationFlow'))

// Forgot Password
export const initPasswordRecoveryFlow = (): AxiosPromise<RecoveryFlow> =>
  newKratosSdk().createBrowserRecoveryFlow().catch(handleKratosSdkError('createBrowserRecoveryFlow'))

export const updatePasswordRecoveryFlowEmail = async (flow: RecoveryFlow, email: string) => {
  const csrf_token = extractValue(flow, 'csrf_token')
  return newKratosSdk()
    .updateRecoveryFlow({
      flow: flow.id,
      updateRecoveryFlowBody: { method: 'code', email, csrf_token },
    })
    .catch(handleKratosSdkError('updateRecoveryFlowEmail'))
}

export const updatePasswordRecoveryFlowCode = async (flow: RecoveryFlow, code: string) => {
  const csrf_token = extractValue(flow, 'csrf_token')
  return newKratosSdk()
    .updateRecoveryFlow({
      flow: flow.id,
      updateRecoveryFlowBody: { method: 'code', code, csrf_token },
    })
    .catch(handleKratosSdkError('updateRecoveryFlowCode'))
}

// Change Password
// https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/createNativeSettingsFlow
export const initSettingsFlow = (): AxiosPromise<SettingsFlow> =>
  newKratosSdk().createBrowserSettingsFlow().catch(handleKratosSdkError('createBrowserSettingsFlow'))

export const getSettingsFlow = (flowId: string): AxiosPromise<SettingsFlow> =>
  newKratosSdk().getSettingsFlow({ id: flowId }).catch(handleKratosSdkError('getSettingsFlow'))

export const submitSettingsFlow = (flow: SettingsFlow, password: string): AxiosPromise<SettingsFlow> => {
  const csrf_token = extractValue(flow, 'csrf_token')
  return newKratosSdk()
    .updateSettingsFlow(
      { flow: flow.id, updateSettingsFlowBody: { method: 'password', password, csrf_token } },
      { withCredentials: true }
    )
    .catch(handleKratosSdkError('updateSettingsFlow'))
}

export const submitSettingsFlowProfile = (flow: SettingsFlow, traits: object): AxiosPromise<SettingsFlow> => {
  const csrf_token = extractValue(flow, 'csrf_token')
  return newKratosSdk()
    .updateSettingsFlow(
      { flow: flow.id, updateSettingsFlowBody: { method: 'profile', traits, csrf_token } },
      { withCredentials: true }
    )
    .catch(handleKratosSdkError('updateSettingsFlowEmail'))
}

export const initVerificationFlow = async () =>
  newKratosSdk().createBrowserVerificationFlow().catch(handleKratosSdkError('createBrowserVerificationFlow'))

export const getVerificationFlow = async (flowId: string) =>
  newKratosSdk().getVerificationFlow({ id: flowId }).catch(handleKratosSdkError('getVerificationFlow'))

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
  return newKratosSdk()
    .updateVerificationFlow({
      flow: flow.id,
      token: code,
      updateVerificationFlowBody: {
        method: 'code',
        csrf_token,
        email,
        code,
      },
    })
    .then(({ data }) => data)
    .catch(handleKratosSdkError('updateVerificationFlow'))
}
