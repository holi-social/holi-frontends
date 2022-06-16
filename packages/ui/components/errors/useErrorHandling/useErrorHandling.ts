import * as Sentry from '@sentry/react-native'
import { Alert } from 'react-native'

import { UseErrorHandling } from './types'

const useErrorHandling: UseErrorHandling = () => {
  const logError = (error: Error, stack?: string) => {
    console.error('[useErrorHandling.ts]', error, stack)
    Sentry.captureException(error)
  }
  return {
    logError,
    displayError: (error: Error, message?: string) => {
      logError(error)
      const errorMessage = message || 'Something went wrong'
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      Alert.alert('Error', `${errorMessage}: ${error.message}`, [{ text: 'OK', onPress: () => {} }])
    },
  }
}

export default useErrorHandling
