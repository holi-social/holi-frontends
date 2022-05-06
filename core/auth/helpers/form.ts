// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/form.tsx
import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from '@ory/kratos-client'
import { AxiosError } from 'axios'

export const isUiNodeAnchorAttributes = (pet: UiNodeAttributes): pet is UiNodeAnchorAttributes => {
  return (pet as UiNodeAnchorAttributes).href !== undefined
}

export const isUiNodeImageAttributes = (pet: UiNodeAttributes): pet is UiNodeImageAttributes => {
  return (pet as UiNodeImageAttributes).src !== undefined
}

export const isUiNodeInputAttributes = (pet: UiNodeAttributes): pet is UiNodeInputAttributes => {
  return (pet as UiNodeInputAttributes).name !== undefined
}

export const isUiNodeTextAttributes = (pet: UiNodeAttributes): pet is UiNodeTextAttributes => {
  return (pet as UiNodeTextAttributes).text !== undefined
}

export const getNodeId = ({ attributes }: UiNode) => {
  if (isUiNodeInputAttributes(attributes)) {
    return attributes.name
  } else {
    return attributes.id
  }
}

export const getNodeValue = ({ attributes }: UiNode) => {
  if (isUiNodeInputAttributes(attributes)) {
    return attributes.value
  }
}

export const getNodeTitle = ({ attributes, meta }: UiNode): string => {
  if (isUiNodeInputAttributes(attributes)) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleFormSubmitError = (setFlow: (p: any) => void, initializeFlow: () => void) => {
  return (err: AxiosError) => {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          if (typeof err.response.data.error === 'object') {
            console.error('[auth/helpers/form.ts] 400 error:', err.response)
          }

          console.info('[auth/helpers/form.ts] Form validation failed.')
          // The error response data contains a flow with the error messages.
          // This is data is here set to be the new flow.
          setFlow(err.response.data)
          break
        case 404:
        case 410:
          // This happens when the flow is, for example, expired or was deleted.
          // We simply re-initialize the flow if that happens!
          console.error('[auth] Flow could not be found, reloading page: ', err.response)
          initializeFlow()
      }
    }

    throw err
  }
}
