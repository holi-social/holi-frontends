import React from 'react'
import { act, render, screen, userEvent } from '@testing-library/react-native'
import { useAnonCount } from '@holi/core/domain/shared/hooks'
import { useIsFocused } from '@holi/core/helpers/useIsFocused'
import { updateConsentState, useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent, ConsentState, TrackingPurpose } from '@holi/core/tracking/types'
import TrackingConsentModalMobile from '@holi/core/components/TrackingConsentModal'

jest.mock('@holi/core/helpers/useIsFocused')
const mockUseIsFocused = jest.mocked(useIsFocused)

jest.mock('@holi/core/tracking/TrackingInitializer')
const mockUseConsentState = jest.mocked(useConsentState)
const mockUpdateConsentState = jest.mocked(updateConsentState)

jest.mock('@holi/core/domain/shared/hooks')
const mockAnonCount = jest.fn<void, [string]>()
const mockUseAnonCount = jest.mocked(useAnonCount)

describe('TrackingConsentModalMobile', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseIsFocused.mockReturnValue(true)
    mockUseConsentState.mockReturnValue([ConsentState.unknown, { loading: false }])
    mockUseAnonCount.mockReturnValue(mockAnonCount)
  })
  afterEach(async () => {
    act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })
  describe('when accepting tracking for all purposes', () => {
    it('updates consent state and calls hooks', async () => {
      const user = userEvent.setup()

      render(<TrackingConsentModalMobile />)
      act(jest.runAllTimers)

      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_shown')

      await user.press(screen.getByLabelText('tracking.consentModal.general.button.acceptAll'))

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Given,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_accepted_all')
    })
  })
  describe('when denying tracking for all purposes', () => {
    it('updates consent state and calls hooks', async () => {
      const user = userEvent.setup()

      render(<TrackingConsentModalMobile />)
      act(jest.runAllTimers)

      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_shown')

      await user.press(screen.getByLabelText('tracking.consentModal.general.button.denyAll'))

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Denied,
        [TrackingPurpose.Personalization]: Consent.Denied,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_denied_all')
    })
  })
  describe('when confirming tracking choices', () => {
    it('[given personalization + denied analytics + denied ad partners] updates consent state and calls hooks', async () => {
      const user = userEvent.setup()

      render(<TrackingConsentModalMobile />)
      act(jest.runAllTimers)

      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_shown')

      await user.press(screen.getByLabelText('tracking.consentModal.general.button.manageOptions'))
      act(jest.runAllTimers)

      await user.press(screen.getByText('tracking.consentModal.manageOptions.personalizationBox.title'))
      await user.press(screen.getByLabelText('tracking.consentModal.manageOptions.button.confirmMyChoices'))

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Denied,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_options_accepted_personalization')
    })

    it('[denied personalization + given analytics + denied ad partners] updates consent state and calls hooks', async () => {
      const user = userEvent.setup()

      render(<TrackingConsentModalMobile />)
      act(jest.runAllTimers)

      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_shown')

      await user.press(screen.getByLabelText('tracking.consentModal.general.button.manageOptions'))
      act(jest.runAllTimers)

      await user.press(screen.getByText('tracking.consentModal.manageOptions.productAnalyticsBox.title'))
      await user.press(screen.getByLabelText('tracking.consentModal.manageOptions.button.confirmMyChoices'))

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Denied,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_options_accepted_analytics')
    })

    it('[given personalization + given analytics + denied ad partners] updates consent state and calls hooks', async () => {
      const user = userEvent.setup()

      render(<TrackingConsentModalMobile />)
      act(jest.runAllTimers)

      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_shown')

      await user.press(screen.getByLabelText('tracking.consentModal.general.button.manageOptions'))
      act(jest.runAllTimers)

      await user.press(screen.getByText('tracking.consentModal.manageOptions.personalizationBox.title'))
      await user.press(screen.getByText('tracking.consentModal.manageOptions.productAnalyticsBox.title'))
      await user.press(screen.getByLabelText('tracking.consentModal.manageOptions.button.confirmMyChoices'))

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_options_accepted_analytics_personalization')
    })

    it('[denied personalization + denied analytics + denied ad partners] updates consent state and calls hooks', async () => {
      const user = userEvent.setup()

      render(<TrackingConsentModalMobile />)
      act(jest.runAllTimers)

      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_shown')

      await user.press(screen.getByLabelText('tracking.consentModal.general.button.manageOptions'))
      act(jest.runAllTimers)

      await user.press(screen.getByLabelText('tracking.consentModal.manageOptions.button.confirmMyChoices'))

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Denied,
        [TrackingPurpose.Personalization]: Consent.Denied,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith(
        'tracking_consent_modal_options_denied_analytics_personalization_ad_partners'
      )
    })

    it('[given personalization + given analytics + given ad partners] updates consent state and calls hooks', async () => {
      const user = userEvent.setup()

      render(<TrackingConsentModalMobile />)
      act(jest.runAllTimers)

      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_shown')

      await user.press(screen.getByLabelText('tracking.consentModal.general.button.manageOptions'))
      act(jest.runAllTimers)

      await user.press(screen.getByText('tracking.consentModal.manageOptions.personalizationBox.title'))
      await user.press(screen.getByText('tracking.consentModal.manageOptions.productAnalyticsBox.title'))
      await user.press(screen.getByText('tracking.consentModal.manageOptions.adPartnerAnalyticsBox.title'))
      await user.press(screen.getByLabelText('tracking.consentModal.manageOptions.button.confirmMyChoices'))

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Given,
      })
      expect(mockAnonCount).toHaveBeenCalledWith(
        'tracking_consent_modal_options_accepted_analytics_personalization_ad_partners'
      )
    })
  })
})
