import { useEffect } from 'react'

import { useIsFocused } from '@holi/core/helpers/useIsFocused'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { ConsentState } from '@holi/core/tracking/types'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

export const useConsentModal = () => {
  const isFocused = useIsFocused()
  const [consentState, { loading: consentStateLoading }] = useConsentState()
  const consentStateUnknown = ConsentState.isUnknown(consentState)

  const { visible, show, hide } = useModalState()

  // listen on different events to show consent modal
  useEffect(() => {
    if (isFocused && !consentStateLoading && consentStateUnknown) {
      setTimeout(() => requestAnimationFrame(() => show()), 300)
    }
  }, [isFocused, consentStateLoading, consentStateUnknown, show])

  return {
    visible,
    show,
    hide,
  }
}
