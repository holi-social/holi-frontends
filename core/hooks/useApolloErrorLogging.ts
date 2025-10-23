import { useEffect } from 'react'
import { ApolloError } from '@apollo/client/v4-migration'
import { logError } from '@holi/core/errors/helpers'
import type { ErrorContext } from '@holi/core/errors/helpers/logError.shared'

export const useApolloErrorLogging = (error: ApolloError | undefined, logMessage: string, context: ErrorContext) => {
  useEffect(() => {
    if (error) {
      logError(error, logMessage, context)
    }
  }, [error, logMessage, context])
}
