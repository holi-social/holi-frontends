import { useEffect } from 'react'

import { useModalState } from '@holi/ui/components/molecules/HoliModal'

import { SCREENS_TO_VISIT_COUNT, useUserVisitedScreensCount } from './userVisitedScreensCount'

export const useConsentModal = () => {
  const userVisitedScreensCount = useUserVisitedScreensCount()
  const needToShowTrackingConsent = SCREENS_TO_VISIT_COUNT === userVisitedScreensCount

  const { visible, show, hide } = useModalState()

  useEffect(() => {
    if (needToShowTrackingConsent) {
      setTimeout(() => requestAnimationFrame(() => show()), 300)
    }
  }, [needToShowTrackingConsent, show])

  return {
    visible,
    show,
    hide,
  }
}
