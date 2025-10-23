import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { isUnauthorizedError, logError, logErrorLocal } from '@holi/core/errors/helpers'
import { type ErrorContext, isNetworkConnectionError } from '@holi/core/errors/helpers/logError.shared'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { CombinedGraphQLErrors } from '@apollo/client'

interface ToastErrorInfo extends ErrorContext {
  timeout?: number
  displayMessage?: string
  testID?: string
}

const isApolloError = (error: unknown): error is CombinedGraphQLErrors => error instanceof CombinedGraphQLErrors

const extractTestID = (error: unknown): string | undefined => {
  if (isApolloError(error)) {
    const cause = error.cause
    if (typeof cause === 'object' && cause !== null && 'testID' in cause) {
      const testID = cause.testID
      if (typeof testID === 'string') {
        return testID
      }
    }
  }
  return undefined
}

export const useErrorHandling = () => {
  const { t } = useTranslation()
  const { openToast } = useToast()

  const displayError = useCallback(
    (error: unknown, logMessage: string, { displayMessage, timeout, testID, ...context }: ToastErrorInfo) => {
      if (!isNetworkConnectionError(error) && !isUnauthorizedError(error)) {
        if (isApolloError(error) && error.message === 'Bad user input') {
          logErrorLocal(error, logMessage, context)
        } else {
          logError(error, logMessage, context)
        }
        openToast(displayMessage || t('global.technicalError'), HoliToastType.ERROR, {
          timeout,
          testID: testID || extractTestID(error),
        })
      }
    },
    [t, openToast]
  )

  return {
    displayError,
  }
}
