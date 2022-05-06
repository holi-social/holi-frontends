// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/form.tsx
import {
  GenericError,
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
export const handleFormSubmitError = (setConfig: (p: any) => void, initialize: () => void, logout?: () => void) => {
  return (err: AxiosError) => {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          if (typeof err.response.data.error === 'object') {
            const ge: GenericError = err.response.data

            console.log('[auth/helpers/form.tsx] 400 error:', ge.message)

            return Promise.resolve()
          }

          console.debug('[auth] Form validation failed:', err.response.data)
          setConfig(err.response.data)
          return Promise.resolve()
        case 404:
        case 410:
          // This happens when the flow is, for example, expired or was deleted.
          // We simply re-initialize the flow if that happens!
          console.debug('[auth] Flow could not be found, reloading page.')
          initialize()
          return Promise.resolve()
        case 403:
        case 401:
          if (!logout) {
            console.error('[auth] Received unexpected 401/403 status code: ', err, err.response.data)
            return Promise.resolve()
          }

          // This happens when the privileged session is expired but the user tried
          // to modify a privileged field (e.g. change the password).
          console.warn(
            '[auth] The server indicated that this action is not allowed for you. The most likely cause of that is that you modified a privileged field (e.g. your password) but your ORY Kratos Login Session is too old.'
          )
          console.log('[auth] Please re-authenticate before making these changes.')
          logout()
          return Promise.resolve()
      }
    }

    console.error(err, err.response?.data)
    return Promise.resolve()
  }
}
