import { ApolloError } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { logError, logErrorLocal } from '@holi/core/errors/helpers/logError'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export const useErrorHandling = () => {
  const { t } = useTranslation()
  const { openToast } = useToast()

  const isApolloError = (error: unknown): error is ApolloError => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as ApolloError).message === 'string' &&
      'graphQLErrors' in error
    )
  }

  const displayError = useCallback(
    (error: unknown, message?: string, timeout?: number, testID?: string) => {
      if (isApolloError(error) && error.message === 'Bad user input') {
        logErrorLocal(error, message)
      } else {
        logError(error, message)
      }
      openToast(message || t('global.technicalError'), HoliToastType.ERROR, timeout, testID)
    },
    [t, openToast]
  )

  return {
    displayError,
  }
}
