import { useState } from 'react'

import { updateConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent, TrackingPurpose } from '@holi/core/tracking/types'

export const useConsentModalState = (onFinish?: () => void) => {
  const [{ allowPersonalization, allowProductAnalytics }, setState] = useState({
    allowPersonalization: false,
    allowProductAnalytics: false,
  })

  const onPersonalizationChange = (allowPersonalization: boolean) =>
    setState((prevState) => ({
      ...prevState,
      allowPersonalization,
    }))

  const onProductAnalyticsChange = (allowProductAnalytics: boolean) =>
    setState((prevState) => ({
      ...prevState,
      allowProductAnalytics,
    }))

  // Event handlers
  const acceptAll = () => {
    setState({ allowPersonalization: true, allowProductAnalytics: true })
    updateConsentState({
      [TrackingPurpose.Analytics]: Consent.Given,
      [TrackingPurpose.Personalization]: Consent.Given,
    })
    onFinish?.()
  }

  const declineAll = () => {
    setState({ allowPersonalization: false, allowProductAnalytics: false })
    updateConsentState({
      [TrackingPurpose.Analytics]: Consent.Denied,
      [TrackingPurpose.Personalization]: Consent.Denied,
    })
    onFinish?.()
  }

  const acceptMyChoices = () => {
    updateConsentState({
      [TrackingPurpose.Analytics]: allowProductAnalytics ? Consent.Given : Consent.Denied,
      [TrackingPurpose.Personalization]: allowPersonalization ? Consent.Given : Consent.Denied,
    })
    onFinish?.()
  }

  return {
    allowPersonalization,
    allowProductAnalytics,
    onPersonalizationChange,
    onProductAnalyticsChange,
    acceptAll,
    declineAll,
    acceptMyChoices,
  }
}
