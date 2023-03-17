import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers/logError'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export const useErrorHandling = () => {
  const { t } = useTranslation()
  const { openToast } = useToast()

  const displayError = useCallback(
    (error: unknown, message?: string) => {
      logError(error, message)
      openToast(message || t('global.technicalError'), HoliToastType.ERROR)
    },
    [t, openToast]
  )

  return {
    displayError,
  }
}
