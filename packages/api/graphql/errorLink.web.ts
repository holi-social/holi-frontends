import { ApolloError } from '@apollo/client/v4-migration'
import { ErrorLink } from '@apollo/client/link/error'
import * as Sentry from '@sentry/nextjs'

import { setUnauthorizedErrorStatus } from '@holi/api/graphql/state'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { isErrorOfType, isUnauthorizedError, logError, logErrorLocal } from '@holi/core/errors/helpers'

const errorLink = new ErrorLink(({ graphQLErrors, networkError, operation }) => {
  // Do not log "not found" or "bad user input" errors
  if (graphQLErrors && isErrorOfType({ graphQLErrors }, ['NOT_FOUND', 'BAD_USER_INPUT', 'FORBIDDEN'])) {
    return
  }
  if (graphQLErrors) {
    for (const graphQLError of graphQLErrors) {
      const errorMessage = `Message: ${graphQLError.message}, Location: ${graphQLError.locations}, Path: ${graphQLError.path}`
      const err = new HoliError(errorMessage)
      if (graphQLError instanceof ApolloError) {
        logError(err, `GraphQL Error (ApolloError) ${JSON.stringify(graphQLError)}`, { location: 'errorLink.web' })
        continue
      }

      logErrorLocal(err, `GraphQL Error ${JSON.stringify(graphQLError)}`, { location: 'errorLink.web' })
      Sentry.getCurrentScope()
        .addBreadcrumb({
          type: 'default',
          category: 'graphql',
          data: {
            query: operation?.query?.loc?.source,
            variables: operation?.variables,
          },
          level: 'debug',
          timestamp: Date.now(),
        })
        .captureException(err)
    }
  }
  if (networkError) {
    if (isUnauthorizedError(networkError)) {
      setUnauthorizedErrorStatus(true)
    } else {
      logError(
        networkError,
        `Network error: ${JSON.stringify(networkError)}; GraphQLErrors: ${JSON.stringify(graphQLErrors)}; Query "${operation?.operationName}": ${JSON.stringify(
          operation?.query
        )}`,
        {
          location: 'errorLink.web',
        }
      )
    }
  }
})

export default errorLink
