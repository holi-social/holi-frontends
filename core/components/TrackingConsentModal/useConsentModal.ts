import { useEffect } from 'react'

import { useIsFocused } from '@holi/core/helpers/useIsFocused'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { ConsentState } from '@holi/core/tracking/types'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { useAnonCount } from '@holi/core/domain/shared/hooks'

export const useConsentModal = () => {
  const isFocused = useIsFocused()
  const [consentState, { loading: consentStateLoading }] = useConsentState()
  const consentStateUnknown = ConsentState.isUnknown(consentState)
  const anonCount = useAnonCount()

  const { visible, show, hide } = useModalState()

  // listen on different events to show consent modal
  useEffect(() => {
    if (isFocused && !consentStateLoading && consentStateUnknown) {
      setTimeout(
        () =>
          requestAnimationFrame(() => {
            show()
            anonCount('tracking_consent_modal_shown')
          }),
        300
      )
    }
  }, [isFocused, consentStateLoading, consentStateUnknown, show, anonCount])

  return {
    visible,
    show,
    hide,
  }
}
