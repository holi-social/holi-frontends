import { useEffect } from 'react'
import { logError } from '@holi/core/errors/helpers'
import type { ErrorContext } from '@holi/core/errors/helpers/logError.shared'
import type { ErrorLike } from '@apollo/client'

export const useApolloErrorLogging = (error: ErrorLike | undefined, logMessage: string, context: ErrorContext) => {
  useEffect(() => {
    if (error) {
      logError(error, logMessage, context)
    }
  }, [error, logMessage, context])
}
