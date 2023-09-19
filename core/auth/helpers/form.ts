// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/form.tsx
import {
  LoginFlow,
  RecoveryFlow,
  SettingsFlow,
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
  VerificationFlow,
} from '@ory/kratos-client'
import { AxiosError } from 'axios'

import { logError, logErrorLocal } from '@holi/core/errors/helpers'

const HIDDEN_FIELDS = ['traits.name', 'traits.consent', 'traits.given_name', 'traits.family_name', 'traits.identity']

export const oryNodeIsLink = (pet: UiNodeAttributes): pet is UiNodeAnchorAttributes => {
  return (pet as UiNodeAnchorAttributes).href !== undefined
}

export const oryNodeIsImage = (pet: UiNodeAttributes): pet is UiNodeImageAttributes => {
  return (pet as UiNodeImageAttributes).src !== undefined
}

export const oryNodeIsInput = (pet: UiNodeAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name !== undefined && (pet as UiNodeInputAttributes).type !== 'submit'
}

export const oryNodeIsCheckbox = (pet: UiNodeAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name !== undefined && (pet as UiNodeInputAttributes).type === 'checkbox'
}

export const oryNodeIsSubmit = (pet: UiNodeAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name !== undefined && (pet as UiNodeInputAttributes).type === 'submit'
}

export const oryNodeIsButton = (pet: UiNodeAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name !== undefined && (pet as UiNodeInputAttributes).type === 'button'
}

export const oryNodeIsHidden = (pet: UiNodeAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).type === 'hidden'
}

export const oryNodeIsText = (pet: UiNodeAttributes): pet is UiNodeTextAttributes => {
  return (pet as UiNodeTextAttributes).text !== undefined
}

export const oryNodeIsHiddenField = (pet: UiNodeAttributes & { name: string }): pet is UiNodeInputAttributes => {
  return HIDDEN_FIELDS.includes(pet.name)
}

export const getNodeId = ({ attributes }: UiNode) => {
  if (oryNodeIsInput(attributes) || oryNodeIsButton(attributes) || oryNodeIsCheckbox(attributes)) {
    return attributes.name
  } else if (oryNodeIsSubmit(attributes)) {
    return attributes.value
  } else {
    return attributes.id
  }
}

export const getNodeValue = ({ attributes }: UiNode) => {
  if (oryNodeIsInput(attributes) || oryNodeIsSubmit(attributes)) {
    return attributes.value
  }
}

export const getNodeTitle = ({ attributes, meta }: UiNode): string => {
  if (oryNodeIsInput(attributes) || oryNodeIsSubmit(attributes)) {
    if (meta?.label?.text) {
      return meta.label.text
    }
    return attributes.name
  }

  if (meta?.label?.text) {
    return meta.label.text
  }

  return ''
}

export const getNodeById = (nodeName: string, flow: SettingsFlow | RecoveryFlow) => {
  return flow.ui.nodes.filter((node: UiNode) => getNodeId(node) === nodeName)
}

export const findInputNodeByNameAndType = (
  nodeName: string,
  nodeType: string,
  flow: LoginFlow | SettingsFlow | RecoveryFlow
) => {
  return flow.ui.nodes.find(
    (node: UiNode) =>
      oryNodeIsInput(node.attributes) && node.attributes.name === nodeName && node.attributes.type === nodeType
  )
}

export const getButtonNodeById = (nodeName: string, flow: SettingsFlow | RecoveryFlow) => {
  return flow.ui.nodes.filter(
    (node: UiNode) =>
      (oryNodeIsSubmit(node.attributes) || oryNodeIsButton(node.attributes)) && getNodeId(node) === nodeName
  )
}

const isAxiosError = (err: AxiosError | unknown): err is AxiosError => {
  return !!(err as AxiosError).response
}

const isVerificationFlowWithErrorData = (errorData: VerificationFlow | unknown): errorData is VerificationFlow => {
  return !!errorData && typeof errorData === 'object' && 'type' in errorData
}

export const isUnverifiedUserError = (error: unknown) => {
  if (!isAxiosError(error)) return
  if (error.response?.status !== 400) return
  if (!isVerificationFlowWithErrorData(error.response.data)) return

  return error.response.data.ui.messages?.some(({ id }) => id === 4000010)
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
        if (typeof err.response.data.error === 'object') {
          logErrorLocal(err.response, '400 error', { location: 'auth.helpers.form.handleFormSubmitError' })
        }

        console.debug('[auth/helpers/form.ts] Form validation failed.')
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
        return
    }
  }

  showError(err as Error)
}
