// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/auth.tsx
import {
  type ContinueWith,
  type ContinueWithVerificationUi,
  ContinueWithVerificationUiActionEnum,
  type LoginFlow,
  type SuccessfulNativeRegistration,
  type UiNode,
  type UpdateLoginFlowBody,
  type UpdateLoginFlowWithPasswordMethod,
} from '@ory/kratos-client'

import {
  getVerificationFlow,
  initLoginFlow,
  initVerificationFlow,
  submitLoginFlow,
  submitVerificationFlow,
} from '@holi/core/auth/helpers/auth/helpers'
import type { VerificationFlowData, VerificationFlowState } from '@holi/core/auth/helpers/useVerificationFlowData'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { ApolloClient } from '@apollo/client'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setLoginStateLoggedIn } from '@holi/core/auth/loginState'
import { clearGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'

export const hasIdentifier = (
  loginFlowBody: VerificationFlowData | UpdateLoginFlowWithPasswordMethod
): loginFlowBody is UpdateLoginFlowWithPasswordMethod => {
  return 'identifier' in loginFlowBody
}

const isContinueWithVerificationUi = (continueWith: ContinueWith): continueWith is ContinueWithVerificationUi => {
  return continueWith.action === ContinueWithVerificationUiActionEnum.ShowVerificationUi
}

export const isOidcUser = (reauthFlow: LoginFlow) => !!reauthFlow.ui.nodes.find((node) => node?.group == 'oidc')

export const getOidcProvider = (reauthFlow: LoginFlow) => {
  const node = reauthFlow.ui.nodes.find((node) => node?.group == 'oidc')
  if (node) {
    return getNodeProviderName(node)
  }
  return undefined
}

export const getIdentity = (loginFlow: LoginFlow) => {
  const node = loginFlow.ui.nodes.find(
    (node) => node?.attributes?.node_type == 'input' && node?.attributes?.name == 'identifier'
  )
  return node?.attributes?.node_type == 'input' ? node?.attributes?.value : undefined
}

export const getNodeProviderName = ({ meta }: UiNode): string | undefined => {
  if (meta?.label?.context && 'provider' in meta.label.context) return meta.label.context.provider as string
  return undefined
}

export const getNodeProviderId = ({ attributes }: UiNode): string | undefined => {
  if (attributes?.node_type === 'input' && attributes.name === 'provider') return attributes.value
  return undefined
}

export const getVerificationFlowFromRegistration = ({
  continue_with,
}: SuccessfulNativeRegistration): VerificationFlowState => {
  // verification flow is disabled in Ory if `verificationFlowData` is `undefined`
  return continue_with?.find(isContinueWithVerificationUi)?.flow ?? 'verification-disabled'
}

interface LoginOptions {
  payload: UpdateLoginFlowBody
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
    flow = (await initLoginFlow()) || flow

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

export const doLogin = async (client: ApolloClient<object>, data: OrySessionContext) => {
  await client.clearStore()
  await setLoginStateLoggedIn(data)
  await clearGuestMode()
}

export const getOrCreateVerificationFlow = async (flowData?: VerificationFlowData) => {
  if (!flowData) throw new HoliError('[Onboarding] no verification flow has been found')

  if (hasIdentifier(flowData)) {
    return resendVerificationEmail(flowData.identifier)
  } else if ('id' in flowData) {
    const { data } = await getVerificationFlow(flowData.id)
    return data
  }
  throw new HoliError('[Onboarding] invalid verification flow: neither identifier or id')
}

export const resendVerificationEmail = async (email: string) => {
  const flow = await initVerificationFlow()
  return submitVerificationFlow({ flow: flow.data, email })
}

export const submitExistingVerificationFlow = async (flowId: string, code: string) => {
  const flow = await getVerificationFlow(flowId)
  return submitVerificationFlow({ flow: flow.data, code })
}
