// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import type {
  LoginFlow,
  PerformNativeLogoutBody,
  RecoveryFlow,
  SettingsFlow,
  UiText,
  UpdateLoginFlowBody,
  VerificationFlow,
} from '@ory/kratos-client'
import type { AxiosPromise } from 'axios'
import * as SecureStore from 'expo-secure-store'

import { extractValue, handleKratosSdkError } from '@holi/core/auth/helpers/helper'
import { newKratosSdk, type OrySessionContext } from '@holi/core/auth/helpers/sdk'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

const userSessionName = 'user_session'

export const syncUserSessionFromOrySession = async () => {
  // nothing to do on mobile
  return null
}

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getSessionFromStorage = async (): Promise<OrySessionContext | null> => {
  try {
    const session = await SecureStore.getItemAsync(userSessionName)
    return session ? (JSON.parse(session) as OrySessionContext) : null
  } catch (err) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
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
export const initLoginFlow = async (flowId?: string): Promise<LoginFlow> => {
  let extraMessages: UiText[] = []
  const returnTo = AuthSession.makeRedirectUri({
    preferLocalhost: true,
    path: 'login/callback',
  })
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
    .createNativeLoginFlow({
      returnTo: returnTo,
      returnSessionTokenExchangeCode: true,
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
    .catch(handleKratosSdkError('createNativeLoginFlow'))
}

export const submitLoginFlow = async (flow: LoginFlow, payload: UpdateLoginFlowBody, sessionToken?: string) =>
  newKratosSdk()
    .updateLoginFlow(
      { flow: flow.id, xSessionToken: sessionToken, updateLoginFlowBody: payload },
      { withCredentials: false }
    )
    .catch(handleKratosSdkError('updateLoginFlow'))

/**
 *
 * @param url The URL is returned by Ory after submitting the login flow as a 422 error and can be parsed from the error with the {@link getBrowserRedirect()} function
 * @param flow The initiated and submitted login flow from Ory
 * @param redirectUrl All redirectUrls passed in here need to be registered in Ory in the Allowed Urls under Branding->Browser redirects
 */
export const doBrowserLogin = async (url: string, flow: LoginFlow) => {
  const redirect = AuthSession.makeRedirectUri({
    preferLocalhost: true,
    path: 'login/callback',
  })
  const result = await WebBrowser.openAuthSessionAsync(url, redirect)
  if (result.type === 'success') {
    const initCode = flow?.session_token_exchange_code
    const returnToCode = new URL(result.url).searchParams.get('code')
    // TODO(SF) handle as error
    if (!initCode || !returnToCode) {
      return
    }
    return newKratosSdk()
      .exchangeSessionToken({ initCode, returnToCode })
      .then((res) => {
        if (res?.data.session_token) {
          const orySession: OrySessionContext = {
            session: res.data.session,
            session_token: res.data.session_token,
          }
          setSessionInStorage(orySession)
          return orySession
        }
      })
  } else {
    // TODO(SF) handle error
    // eslint-disable-next-line no-console
    console.info('Login failed', result)
  }
}

// Logout
export const submitLogoutFlow = async (payload: PerformNativeLogoutBody) => {
  if (payload.session_token) {
    return newKratosSdk()
      .performNativeLogout({ performNativeLogoutBody: payload })
      .catch(handleKratosSdkError('performNativeLogout'))
  }
}

// Re-Auth
export const initReauthFlow = async (sessionToken?: string) =>
  newKratosSdk()
    .createNativeLoginFlow({ refresh: true, xSessionToken: sessionToken })
    .catch(handleKratosSdkError('createNativeLoginFlow'))

export const submitReauthFlow = async (flow: LoginFlow, password: string, sessionToken?: string) => {
  const identifier = extractValue(flow, 'identifier')
  return newKratosSdk()
    .updateLoginFlow(
      { flow: flow.id, updateLoginFlowBody: { method: 'password', identifier, password }, xSessionToken: sessionToken },
      { withCredentials: true }
    )
    .catch(handleKratosSdkError('submitReauthFlow'))
}

// Register
export const initRegistrationFlow = async () =>
  newKratosSdk().createNativeRegistrationFlow().catch(handleKratosSdkError('createNativeRegistrationFlow'))

// Forgot Password
export const initPasswordRecoveryFlow = async () =>
  newKratosSdk().createNativeRecoveryFlow().catch(handleKratosSdkError('createNativeRecoveryFlow'))

export const updatePasswordRecoveryFlowEmail = async (flow: RecoveryFlow, email: string) =>
  newKratosSdk().updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: { method: 'code', email } })

export const updatePasswordRecoveryFlowCode = async (flow: RecoveryFlow, code: string) =>
  newKratosSdk().updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: { method: 'code', code } })

// Change Password
// https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/createNativeSettingsFlow
export const initSettingsFlow = async (sessionToken?: string) =>
  newKratosSdk()
    .createNativeSettingsFlow({ xSessionToken: sessionToken })
    .catch(handleKratosSdkError('createNativeSettingsFlow'))

export const getSettingsFlow = (flowId: string, sessionToken?: string): AxiosPromise<SettingsFlow> =>
  newKratosSdk()
    .getSettingsFlow({ id: flowId, xSessionToken: sessionToken })
    .catch(handleKratosSdkError('getSettingsFlow'))

export const submitSettingsFlow = async (flow: SettingsFlow, password: string, sessionToken?: string) =>
  newKratosSdk()
    .updateSettingsFlow(
      { flow: flow.id, xSessionToken: sessionToken, updateSettingsFlowBody: { method: 'password', password } },
      { withCredentials: false }
    )
    .catch(handleKratosSdkError('updateSettingsFlow'))

export const submitSettingsFlowProfile = (flow: SettingsFlow, traits: object, sessionToken?: string) => {
  return newKratosSdk()
    .updateSettingsFlow(
      { flow: flow.id, xSessionToken: sessionToken, updateSettingsFlowBody: { method: 'profile', traits } },
      { withCredentials: true }
    )
    .catch(handleKratosSdkError('updateSettingsFlowEmail'))
}

// Email verification flow
export const initVerificationFlow = async () =>
  newKratosSdk().createNativeVerificationFlow().catch(handleKratosSdkError('createNativeVerificationFlow'))

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
}) =>
  newKratosSdk()
    .updateVerificationFlow({
      flow: flow.id,
      token: code,
      updateVerificationFlowBody: {
        method: 'code',
        email,
        code,
      },
    })
    .then(({ data }) => data)
    .catch(handleKratosSdkError('updateVerificationFlow'))
