import { ApolloError } from '@apollo/client'

export type graphQLErrorCode = 'NOT_FOUND' | 'BAD_USER_INPUT'

export type FieldError = {
  message: string
  code: string
}

export type FieldErrors = { [key: string]: FieldError[] }

export const isErrorOfType = (error: Pick<ApolloError, 'graphQLErrors'>, errorCodes: graphQLErrorCode[]) =>
  error.graphQLErrors?.some((graphQLError) => errorCodes.includes(graphQLError.extensions?.code))

export const extractFieldErrors = (error: ApolloError): FieldErrors | undefined => {
  const errors = error.graphQLErrors.length && error.graphQLErrors[0].extensions.errors
  try {
    return errors && JSON.parse(errors)
  } catch (e) {
    return undefined
  }
}
