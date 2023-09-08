import { ApolloError } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import * as Sentry from '@sentry/nextjs'

import { setUnauthorizedErrorStatus } from '@holi/api/graphql/client'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { isErrorOfType, isUnauthorizedError, logError, logErrorLocal } from '@holi/core/errors/helpers'

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // Do not log "not found" or "bad user input" errors
  if (graphQLErrors && isErrorOfType({ graphQLErrors }, ['NOT_FOUND', 'BAD_USER_INPUT'])) {
    return
  }
  if (graphQLErrors) {
    for (const graphQLError of graphQLErrors) {
      const errorMessage = `Message: ${graphQLError.message}, Location: ${graphQLError.locations}, Path: ${graphQLError.path}`
      const err = new HoliError(errorMessage)
      if (graphQLError instanceof ApolloError) {
        logError(err, '[GraphQL Error]')
        continue
      }

      logErrorLocal(err, '[GraphQL Error]')

      Sentry.configureScope((scope: Sentry.Scope) => {
        scope.addBreadcrumb({
          type: 'default',
          category: 'graphql',
          data: {
            query: operation?.query?.loc?.source,
            variables: operation?.variables,
          },
          level: 'debug',
          timestamp: Date.now(),
        })
        Sentry.captureException(err)
      })
    }
  }
  if (networkError) {
    if (isUnauthorizedError(networkError)) {
      setUnauthorizedErrorStatus(true)
    } else {
      logError(networkError, '[Network error]')
    }
  }
})

export default errorLink
