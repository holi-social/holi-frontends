import * as Sentry from '@sentry/nextjs'

import { UseErrorHandling } from './types'

const useErrorHandling: UseErrorHandling = () => {
  const logError = (error: Error, message?: string, stack?: string) => {
    const errorMessage = message ? ` ${message}:` : ''
    console.error('[useErrorHandling.web.ts]' + errorMessage, error, stack)
    Sentry.captureException(error)
  }
  return {
    logError,
    displayError: (error: Error, message?: string) => {
      logError(error, message)
      if (window) {
        const errorMessage = message || 'Something went wrong'
        alert(`${errorMessage}: ${error.message}`)
      }
    },
  }
}

export default useErrorHandling
