import { ApolloError } from '@apollo/client'

export type graphQLErrorCode = 'NOT_FOUND'

export type FieldError = {
  message: string
  code: string
}

export type FieldErrors = { [key: string]: FieldError[] }

export const isNotFoundError = (error: Pick<ApolloError, 'graphQLErrors'>) => isErrorOfType(error, 'NOT_FOUND')

const isErrorOfType = (error: Pick<ApolloError, 'graphQLErrors'>, errorCode: graphQLErrorCode) =>
  error.graphQLErrors?.some((graphQLError) => graphQLError.extensions?.code === errorCode)

export const extractFieldErrors = (error: ApolloError): FieldErrors | undefined => {
  const errors = error.graphQLErrors.length && error.graphQLErrors[0].extensions.errors
  try {
    return errors && JSON.parse(errors)
  } catch (e) {
    return undefined
  }
}
