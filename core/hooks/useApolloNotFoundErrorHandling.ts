import { useEffect } from 'react'
import type { ApolloError } from '@apollo/client'
import { isForbiddenError, isNotFoundError, logError } from '@holi/core/errors/helpers'
import type { ErrorContext } from '@holi/core/errors/helpers/logError.shared'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export const useApolloNotFoundErrorHandling = (
  error: ApolloError | undefined,
  logMessage: string,
  context: ErrorContext
) => {
  const { replaceRoute } = useRouting()

  useEffect(() => {
    if (error) {
      if (
        isNotFoundError(error) ||
        isForbiddenError(error) ||
        // This error hints at usage of an invalid id
        error.message.includes('badly formed hexadecimal UUID string')
      ) {
        replaceRoute('/404')
      } else {
        logError(error, logMessage, context)
      }
    }
  }, [error, logMessage, context, replaceRoute])
}
