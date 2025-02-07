import { useState } from 'react'

import { updateConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent, TrackingPurpose } from '@holi/core/tracking/types'
import { useAnonCount } from '@holi/core/domain/shared/hooks'

export const useConsentModalState = (onFinish: () => void) => {
  const [{ allowPersonalization, allowProductAnalytics }, setState] = useState({
    allowPersonalization: false,
    allowProductAnalytics: false,
  })
  const anonCount = useAnonCount()

  const onTogglePersonalization = () =>
    setState((prevState) => ({
      ...prevState,
      allowPersonalization: !allowPersonalization,
    }))

  const onToggleProductAnalytics = () =>
    setState((prevState) => ({
      ...prevState,
      allowProductAnalytics: !allowProductAnalytics,
    }))

  // Event handlers
  const acceptAll = () => {
    setState({ allowPersonalization: true, allowProductAnalytics: true })
    updateConsentState({
      [TrackingPurpose.Analytics]: Consent.Given,
      [TrackingPurpose.Personalization]: Consent.Given,
    })
    anonCount('tracking_consent_modal_accepted_all')
    onFinish()
  }

  const denyAll = () => {
    setState({ allowPersonalization: false, allowProductAnalytics: false })
    updateConsentState({
      [TrackingPurpose.Analytics]: Consent.Denied,
      [TrackingPurpose.Personalization]: Consent.Denied,
    })
    anonCount('tracking_consent_modal_denied_all')
    onFinish()
  }

  const acceptMyChoices = () => {
    const cs = {
      [TrackingPurpose.Analytics]: allowProductAnalytics ? Consent.Given : Consent.Denied,
      [TrackingPurpose.Personalization]: allowPersonalization ? Consent.Given : Consent.Denied,
    }
    updateConsentState(cs)
    if (allowPersonalization && allowProductAnalytics) {
      anonCount('tracking_consent_modal_options_accepted_analytics_personalization')
    } else if (allowProductAnalytics) {
      anonCount('tracking_consent_modal_options_accepted_analytics')
    } else if (allowPersonalization) {
      anonCount('tracking_consent_modal_options_accepted_personalization')
    } else {
      anonCount('tracking_consent_modal_options_denied_analytics_personalization')
    }
    onFinish()
  }

  return {
    allowPersonalization,
    allowProductAnalytics,
    onTogglePersonalization,
    onToggleProductAnalytics,
    acceptAll,
    denyAll,
    acceptMyChoices,
  }
}
