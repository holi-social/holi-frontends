import { GenericError, LoginFlow, SettingsFlow, UiNodeInputAttributes, VerificationFlow } from '@ory/kratos-client'
import type { AxiosError } from 'axios'

import { oryNodeIsInput } from '@holi/core/auth/helpers/form'
import { logError } from '@holi/core/errors/helpers'

export const extractValue = (flow: LoginFlow | SettingsFlow | VerificationFlow, key: string): string => {
  return flow.ui.nodes
    .filter((node) => oryNodeIsInput(node.attributes))
    .map((node) => node.attributes as UiNodeInputAttributes)
    .filter((attributes) => attributes.name === key)[0].value
}

interface KratosErrorHandlingOptions {
  errorCodesToIgnore?: string[]
}

export const handleKratosSdkError =
  (method: string, { errorCodesToIgnore = [] }: KratosErrorHandlingOptions = {}) =>
  (error: unknown) => {
    const errorDetails: GenericError = (error as AxiosError)?.response?.data?.error || {}
    if (errorDetails.id && errorCodesToIgnore.includes(errorDetails.id)) {
      return error
    }
    logError(error, `[kratosSdk.${method}] ${errorDetails.reason}`, {
      context: {
        method: `kratosSdk.${method}`,
        ...errorDetails,
      },
    })
    throw error
  }
