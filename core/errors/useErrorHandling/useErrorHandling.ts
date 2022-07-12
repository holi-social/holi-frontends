import * as Sentry from '@sentry/react-native'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { UseErrorHandling } from './types'

export const logError = (error: Error, message?: string, stack?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  console.error('[useErrorHandling.ts]' + errorMessage, error, stack)
  Sentry.captureException(error)
}

const useErrorHandling: UseErrorHandling = () => {
  const { t } = useTranslation()

  return {
    logError,
    displayError: (error: Error, message?: string) => {
      logError(error, message)
      const messageHeadline = message || t('error.alert.headline')
      try {
        const detailMessage = error ? error.message : ''
        Alert.alert(t('error.alert.title'), `${messageHeadline}: ${detailMessage}`, [
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          { text: t('error.alert.button'), onPress: () => {} },
        ])
      } catch (e) {
        console.error('[useErrorHandling.ts] Unespected error' + e)
      }
    },
  }
}

export default useErrorHandling
