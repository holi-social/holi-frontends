import { CombinedGraphQLErrors, ServerError, type ErrorLike } from '@apollo/client'

export type graphQLErrorCode = 'NOT_FOUND' | 'BAD_USER_INPUT' | 'FORBIDDEN' | 'MALICIOUS_URL'

export type FieldError = {
  message: string
  code: string
}

export type FieldErrors = { [key: string]: FieldError[] }

export const isGraphQLErrorOfType = (
  error: ErrorLike,
  errorCodes: graphQLErrorCode[]
): error is CombinedGraphQLErrors =>
  CombinedGraphQLErrors.is(error) &&
  error.errors?.some((graphQLError) => errorCodes.includes(graphQLError.extensions?.code as graphQLErrorCode))

export const extractFieldErrors = (error: ErrorLike): FieldErrors | undefined => {
  if (!CombinedGraphQLErrors.is(error)) {
    return undefined
  }
  const errors = error.errors.length && error.errors[0].extensions?.errors
  try {
    return errors ? JSON.parse(errors as string) : undefined
  } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
    return undefined
  }
}

export const isNotFoundError = (error: ErrorLike) => isGraphQLErrorOfType(error, ['NOT_FOUND'])

export const isForbiddenError = (error: ErrorLike) => isGraphQLErrorOfType(error, ['FORBIDDEN'])

export const isMaliciousUrlError = (error: ErrorLike) => isGraphQLErrorOfType(error, ['MALICIOUS_URL'])

export const isServerError = (error: unknown): error is ServerError => {
  return ServerError.is(error)
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
