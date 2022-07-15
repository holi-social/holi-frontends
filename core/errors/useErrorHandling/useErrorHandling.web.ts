import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'

import { UseErrorHandling } from './types'

export const logError = (error: Error, message?: string, stack?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  console.error('[useErrorHandling.web.ts]' + errorMessage, error, stack)
  Sentry.captureException(error)
}

const useErrorHandling: UseErrorHandling = () => {
  const { t } = useTranslation()

  return {
    logError,
    displayError: (error: Error, message?: string) => {
      logError(error, message)
      if (window) {
        const messageHeadline = message || t('error.alert.headline')
        const detailMessage = error ? error.message : ''
        alert(`${messageHeadline}: ${detailMessage}`)
      }
    },
  }
}

export default useErrorHandling
