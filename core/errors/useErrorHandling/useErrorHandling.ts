import * as Sentry from '@sentry/react-native'
import { Alert } from 'react-native'

import { UseErrorHandling } from './types'

const useErrorHandling: UseErrorHandling = () => {
  const logError = (error: Error, message?: string, stack?: string) => {
    const errorMessage = message ? ` ${message}:` : ''
    console.error('[useErrorHandling.ts]' + errorMessage, error, stack)
    Sentry.captureException(error)
  }
  return {
    logError,
    displayError: (error: Error, message?: string) => {
      logError(error, message)
      const messageHeadline = message || 'Something went wrong'
      try {
        const detailMessage = error ? error.message : ''
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        Alert.alert('Error', `${messageHeadline}: ${detailMessage}`, [{ text: 'OK', onPress: () => {} }])
      } catch (e) {
        console.error('[useErrorHandling.ts] Unespected error' + e)
      }
    },
  }
}

export default useErrorHandling
