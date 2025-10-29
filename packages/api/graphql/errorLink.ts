import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'

import Sentry from '@holi/api/graphql/sentry'
import { setUnauthorizedErrorStatus } from '@holi/api/graphql/state'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { isGraphQLErrorOfType, isUnauthorizedError, logError, logErrorLocal } from '@holi/core/errors/helpers'

const errorLink = new ErrorLink(({ error, operation }) => {
  // Do not log "not found", "forbidden" or "bad user input" errors
  if (isGraphQLErrorOfType(error, ['NOT_FOUND', 'BAD_USER_INPUT', 'FORBIDDEN'])) {
    return
  }
  if (CombinedGraphQLErrors.is(error)) {
    for (const graphQLError of error.errors) {
      const errorMessage = `Message: ${graphQLError.message}, Location: ${graphQLError.locations}, Path: ${graphQLError.path}`
      const err = new HoliError(errorMessage)
      logErrorLocal(err, `[GraphQL Error]: ${JSON.stringify(graphQLError)}`, { location: 'errorLink' })
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
  } else if (isUnauthorizedError(error)) {
    setUnauthorizedErrorStatus(true)
  } else if (CombinedProtocolErrors.is(error)) {
    for (const protocolError of error.errors) {
      const errorMessage = `Message: ${protocolError.message}, Extensions: ${JSON.stringify(protocolError.extensions)}`
      logError(error, `[Protocol error]: ${errorMessage}`, { location: 'errorLink' })
    }
  } else {
    logError(
      error,
      `[Network error]: ${JSON.stringify(error)}; Query "${operation?.operationName}": ${JSON.stringify(
        operation?.query
      )}`,
      { location: 'errorLink' }
    )
  }
})

export default errorLink
