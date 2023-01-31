import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export const useToastForNotAvailableFeature = (onInitialRender = false) => {
  const { t } = useTranslation()
  const { openToast } = useToast()

  const showToast = useCallback(() => {
    openToast?.(t('global.notAvailable'), HoliToastType.SUCCESS, 3000)
  }, [openToast, t])

  useEffect(() => {
    onInitialRender && showToast()
  }, [onInitialRender, showToast])

  return showToast
}
