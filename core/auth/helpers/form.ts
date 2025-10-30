// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/form.tsx
import type {
  LoginFlow,
  RecoveryFlow,
  SettingsFlow,
  UiNode,
  UiNodeAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
  VerificationFlow,
} from '@ory/kratos-client'
import type { AxiosError } from 'axios'

import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { OryErrorCode } from '@holi/core/auth/helpers/auth/errorCodes'

const logger = getLogger('Other')
const HIDDEN_FIELDS = ['traits.name', 'traits.consent', 'traits.given_name', 'traits.family_name', 'traits.identity']

export const oryNodeIsInput = (pet: UiNodeAttributes | UiNodeInputAttributes): pet is UiNodeInputAttributes => {
  return 'name' in pet && pet.type !== 'submit'
}

export const oryNodeIsCheckbox = (pet: UiNodeAttributes | UiNodeInputAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name !== undefined && (pet as UiNodeInputAttributes).type === 'checkbox'
}

export const oryNodeIsSubmit = (pet: UiNodeAttributes | UiNodeInputAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name !== undefined && (pet as UiNodeInputAttributes).type === 'submit'
}

export const oryNodeIsButton = (pet: UiNodeAttributes | UiNodeInputAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name !== undefined && (pet as UiNodeInputAttributes).type === 'button'
}

export const oryNodeIsText = (pet: UiNodeAttributes | UiNodeTextAttributes): pet is UiNodeTextAttributes => {
  return (pet as UiNodeTextAttributes).text !== undefined
}

export const oryNodeIsHiddenField = (pet: UiNodeAttributes | UiNodeInputAttributes): pet is UiNodeInputAttributes => {
  return 'name' in pet && HIDDEN_FIELDS.includes(pet.name)
}

export const oryNodeIsProvider = (pet: UiNodeAttributes | UiNodeInputAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name === 'provider'
}

export const getNodeId = ({ attributes }: UiNode) => {
  if (
    oryNodeIsInput(attributes) ||
    oryNodeIsButton(attributes) ||
    oryNodeIsCheckbox(attributes) ||
    oryNodeIsProvider(attributes)
  ) {
    return attributes.name
  } else if (oryNodeIsSubmit(attributes)) {
    return attributes.value
  } else {
    return attributes.id
  }
}

// For possible Ory Field IDs
// see: https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-message-codes
// and: https://github.com/ory/elements/blob/main/src/locales/en.json
const oryFieldMapping: { [key: number]: string } = {
  1070001: 'Password',
  1070002: 'Email',
  1070004: 'Email',
  1070007: 'Email',
  1010001: 'SignIn',
  1010002: 'ProviderSignIn',
  1010022: 'SignIn',
  1040001: 'SignUp',
  1040002: 'ProviderSignUp',
  1070009: 'SubmitCode',
  1040003: 'Continue',
  1010015: 'SignInCode',
  1040006: 'SignUpCode',
  1070008: 'ResendCode',
  1070013: 'InputSignInCode',
  1070012: 'InputSignUpCode',
}

export const getNodeTranslationKey = ({ meta }: UiNode) => {
  if (meta?.label?.id && meta.label.id in oryFieldMapping) {
    return oryFieldMapping[meta.label.id]
  }
  return
}

export const findInputNodeByNameAndType = (
  nodeName: string,
  nodeType: string,
  flow: LoginFlow | SettingsFlow | RecoveryFlow
) => {
  return flow?.ui?.nodes?.find(
    (node: UiNode) =>
      oryNodeIsInput(node.attributes) && node.attributes.name === nodeName && node.attributes.type === nodeType
  )
}

export const isAxiosError = (err: AxiosError | unknown): err is AxiosError => {
  return !!(err as AxiosError).response
}

const isVerificationFlowWithErrorData = (errorData: VerificationFlow | unknown): errorData is VerificationFlow => {
  return !!errorData && typeof errorData === 'object' && 'type' in errorData
}

export const isUnverifiedUserError = (error: unknown) => {
  if (!isAxiosError(error)) return
  if (error.response?.status !== 400) return
  if (!isVerificationFlowWithErrorData(error.response.data)) return

  return error.response.data.ui.messages?.some(({ id }) => id === OryErrorCode.ACCOUNT_NOT_VERIFIED)
}

export const handleFormSubmitError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFlow: (p: any) => void,
  initializeFlow: () => void,
  showError: (err: Error) => void,
  err: unknown
) => {
  if (isAxiosError(err)) {
    switch (err.response?.status) {
      case 400: {
        const responseData = err.response.data as { error?: { code?: number } }
        if (typeof responseData.error === 'object') {
          if (responseData.error?.code === 500) {
            return
          } else {
            logErrorLocal(err.response, '400 error', { location: 'auth.helpers.form.handleFormSubmitError' })
          }
        }

        logger.debug('auth/helpers/form.handleFormSubmitError', 'form validation failed')
        // The error response data contains a flow with error messages.
        // With this data, the view can display the errors.
        setFlow(err.response.data)
        return
      }
      // case 403:
      //   // https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/updateSettingsFlow
      //   if (err.response.data.error.id === 'session_refresh_required') {
      //     // so something
      //   }
      //   return
      case 404:
      case 410:
        // This happens when the flow is, for example, expired or was deleted.
        // We simply re-initialize the flow if that happens!
        logError(err.response, 'Flow could not be found, reinitializing flow', {
          location: 'auth.helpers.form.handleFormSubmitError',
        })
        initializeFlow()
        showError(err as Error)
        return
    }
  }

  showError(err as Error)
}
