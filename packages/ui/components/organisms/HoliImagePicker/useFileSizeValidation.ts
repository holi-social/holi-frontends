import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export const useFileSizeValidation = () => {
  const { t } = useTranslation()
  const { openToast } = useToast()

  return useCallback(
    ({ fileSize, maxFileSizeInMB }) => {
      const fileSizeValid = !maxFileSizeInMB || (fileSize && fileSize <= maxFileSizeInMB * 1024 * 1024)
      if (!fileSizeValid) {
        openToast(t('filePicker.error.maxFileSize', { size: maxFileSizeInMB }), HoliToastType.ERROR)
      }
      return fileSizeValid
    },
    [openToast, t]
  )
}
