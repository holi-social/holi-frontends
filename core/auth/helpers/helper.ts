import type { GenericError, LoginFlow, SettingsFlow, UiNodeInputAttributes, VerificationFlow } from '@ory/kratos-client'
import type { AxiosError, AxiosResponse } from 'axios'

import { oryNodeIsInput } from '@holi/core/auth/helpers/form'
import { logError } from '@holi/core/errors/helpers'

export type GenericAxiosError = AxiosError<{ error: GenericError }>

export const extractValue = (flow: LoginFlow | SettingsFlow | VerificationFlow, key: string): string => {
  return flow.ui.nodes
    .filter((node) => oryNodeIsInput(node.attributes))
    .map((node) => node.attributes as UiNodeInputAttributes)
    .filter((attributes) => attributes.name === key)[0].value
}

export const handleKratosSdkError =
  (method: string) =>
  (error: GenericAxiosError): never => {
    const response = error?.response
    if (response?.status === 400) {
      // Bad user input should be handled by UI
      throw error
    }
    const errorDetails = response?.data?.error
    return logKratosError(errorDetails, error, response, method)
  }

export const handleKratosSdkErrorIgnoringCodes =
  (method: string, errorCodesToIgnore: string[] = []) =>
  (error: GenericAxiosError) => {
    const response = error?.response
    if (response?.status === 400) {
      // Bad user input should be handled by UI
      throw error
    }
    const errorDetails = response?.data?.error
    if (errorDetails?.id && errorCodesToIgnore.includes(errorDetails.id)) {
      return undefined
    }
    return logKratosError(errorDetails, error, response, method)
  }

const logKratosError = (
  errorDetails: GenericError = { message: 'unknown' },
  error: unknown,
  response: AxiosResponse | undefined,
  method: string
): never => {
  // Filter error details to make sure we do not send any user data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { request, message, details, ...filteredDetails } = errorDetails
  logError(error, `Error from kratosSdk: ${errorDetails.reason || response?.statusText}`, {
    location: 'handleKratosSdkError',
    method: `kratosSdk.${method}`,
    ...filteredDetails,
  })
  throw error
}
