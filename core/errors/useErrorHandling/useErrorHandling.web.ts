import * as Sentry from '@sentry/nextjs'

import { UseErrorHandling } from './types'

const useErrorHandling: UseErrorHandling = () => {
  const logError = (error: Error, stack?: string) => {
    console.error('[useErrorHandling.web.ts]', error, stack)
    Sentry.captureException(error)
  }
  return {
    logError,
    displayError: (error: Error, message?: string) => {
      logError(error)
      const errorMessage = message || 'Something went wrong'
      alert(`${errorMessage}: ${error.message}`)
    },
  }
}

export default useErrorHandling
