import { ApolloError } from '@apollo/client/v4-migration'
import type { ErrorContext } from '@holi/core/errors/helpers/logError.shared'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useEffect } from 'react'

export const useApolloErrorDisplay = (error: ApolloError | undefined, logMessage: string, context: ErrorContext) => {
  const { displayError } = useErrorHandling()

  useEffect(() => {
    if (error) {
      displayError(error, logMessage, context)
    }
  }, [error, logMessage, context, displayError])
}
