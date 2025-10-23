import type { ErrorLike } from '@apollo/client'
import type { ErrorContext } from '@holi/core/errors/helpers/logError.shared'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useEffect } from 'react'

export const useApolloErrorDisplay = (error: ErrorLike | undefined, logMessage: string, context: ErrorContext) => {
  const { displayError } = useErrorHandling()

  useEffect(() => {
    if (error) {
      displayError(error, logMessage, context)
    }
  }, [error, logMessage, context, displayError])
}
