import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError, logErrorLocal } from '@holi/core/errors/helpers/logError'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export const useErrorHandling = () => {
  const { t } = useTranslation()
  const { openToast } = useToast()

  const displayError = useCallback(
    (error: unknown, message?: string, timeout?: number, testID?: string) => {
      if ((error as HoliError).message === 'Bad user input') {
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
