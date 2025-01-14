import { ApolloError, ServerError } from '@apollo/client'

export type graphQLErrorCode = 'NOT_FOUND' | 'BAD_USER_INPUT' | 'FORBIDDEN' | 'MALICIOUS_URL'

export type FieldError = {
  message: string
  code: string
}

export type FieldErrors = { [key: string]: FieldError[] }

export const isErrorOfType = (error: Pick<ApolloError, 'graphQLErrors'>, errorCodes: graphQLErrorCode[]) =>
  error.graphQLErrors?.some((graphQLError) => errorCodes.includes(graphQLError.extensions?.code as graphQLErrorCode))

export const extractFieldErrors = (error: Pick<ApolloError, 'graphQLErrors'>): FieldErrors | undefined => {
  const errors = error.graphQLErrors.length && error.graphQLErrors[0].extensions?.errors
  try {
    return errors ? JSON.parse(errors as string) : undefined
  } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
    return undefined
  }
}

export const isNotFoundError = (error: Pick<ApolloError, 'graphQLErrors'>) => isErrorOfType(error, ['NOT_FOUND'])

export const isForbiddenError = (error: Pick<ApolloError, 'graphQLErrors'>) => isErrorOfType(error, ['FORBIDDEN'])

export const isMaliciousUrlError = (error: Pick<ApolloError, 'graphQLErrors'>) =>
  isErrorOfType(error, ['MALICIOUS_URL'])

export const isServerError = (error: unknown): error is ServerError => {
  return typeof error === 'object' && error !== null && 'statusCode' in error
}

export const isUnauthorizedError = (error: unknown): boolean => {
  return (
    (isServerError(error) && error.statusCode === 401) ||
    (typeof error === 'object' &&
      error !== null &&
      'networkError' in error &&
      isServerError(error.networkError) &&
      error.networkError.statusCode === 401)
  )
}
