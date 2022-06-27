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
      const errorMessage = message || 'Something went wrong'
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      Alert.alert('Error', `${errorMessage}: ${error.message}`, [{ text: 'OK', onPress: () => {} }])
    },
  }
}

export default useErrorHandling
