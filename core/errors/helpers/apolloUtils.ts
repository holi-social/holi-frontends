import { ApolloError } from '@apollo/client'

export type graphQLErrorCode = 'NOT_FOUND'

export const isNotFoundError = (error: Pick<ApolloError, 'graphQLErrors'>) => isErrorOfType(error, 'NOT_FOUND')

const isErrorOfType = (error: Pick<ApolloError, 'graphQLErrors'>, errorCode: graphQLErrorCode) =>
  error.graphQLErrors.some((graphQLError) => graphQLError.extensions.code === errorCode)
