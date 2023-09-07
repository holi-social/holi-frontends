import { ApolloError } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { isUnauthorizedError } from '@holi/core/errors/helpers'
import { logError, logErrorLocal } from '@holi/core/errors/helpers/logError'
import { isNetworkConnectionError } from '@holi/core/errors/helpers/logError.shared'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

const isApolloError = (error: unknown): error is ApolloError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApolloError).message === 'string' &&
    'graphQLErrors' in error
  )
}

const extractTestID = (error: unknown): string | undefined => {
  if (isApolloError(error)) {
    const cause = error.networkError
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
    (error: unknown, message: string, timeout?: number) => {
      if (!isNetworkConnectionError(error) && !isUnauthorizedError(error)) {
        if (isApolloError(error) && error.message === 'Bad user input') {
          logErrorLocal(error, message)
        } else {
          logError(error, message)
        }
        openToast(message || t('global.technicalError'), HoliToastType.ERROR, timeout, extractTestID(error))
      }
    },
    [t, openToast]
  )

  return {
    displayError,
  }
}
