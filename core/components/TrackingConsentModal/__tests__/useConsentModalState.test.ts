import { useConsentModalState } from '@holi/core/components/TrackingConsentModal/useConsentModalState'
import { Consent, TrackingPurpose } from '@holi/core/tracking/types'
import { act, renderHook } from '@testing-library/react-native'
import { updateConsentState } from '@holi/core/tracking/TrackingInitializer'
import { useAnonCount } from '@holi/core/domain/shared/hooks'

jest.mock('@holi/core/tracking/TrackingInitializer')
const mockUpdateConsentState = jest.mocked(updateConsentState)

jest.mock('@holi/core/domain/shared/hooks')
const mockAnonCount = jest.fn<void, [string]>()
const mockUseAnonCount = jest.mocked(useAnonCount)

const onFinish = jest.fn()

describe('useConsentModalState', () => {
  beforeEach(() => {
    mockUseAnonCount.mockReturnValue(mockAnonCount)
  })
  it('initializes assuming no consent for all purposes', async () => {
    const { result } = renderHook(() => useConsentModalState(onFinish))

    act(() => result.current.acceptMyChoices())

    expect(mockUpdateConsentState).toHaveBeenCalledWith({
      [TrackingPurpose.Analytics]: Consent.Denied,
      [TrackingPurpose.Personalization]: Consent.Denied,
      [TrackingPurpose.AdPartners]: Consent.Denied,
    })
    expect(mockAnonCount).toHaveBeenCalledWith(
      'tracking_consent_modal_options_denied_analytics_personalization_ad_partners'
    )
    expect(onFinish).toHaveBeenCalled()
  })
  describe('when accepting tracking for all purposes', () => {
    it('updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.acceptAll())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Given,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_accepted_all')
      expect(onFinish).toHaveBeenCalled()
    })
  })
  describe('when denying tracking for all purposes', () => {
    it('updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.denyAll())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Denied,
        [TrackingPurpose.Personalization]: Consent.Denied,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_denied_all')
      expect(onFinish).toHaveBeenCalled()
    })
  })

  describe('when confirming tracking choices', () => {
    it('[personalization only] updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.onTogglePersonalization())
      act(() => result.current.acceptMyChoices())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Denied,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_options_accepted_personalization')
      expect(onFinish).toHaveBeenCalled()
    })

    it('[analytics only] updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.onToggleProductAnalytics())
      act(() => result.current.acceptMyChoices())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Denied,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_options_accepted_analytics')
      expect(onFinish).toHaveBeenCalled()
    })

    it('[ad partners only] updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.onToggleAdPartnerAnalytics())
      act(() => result.current.acceptMyChoices())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Denied,
        [TrackingPurpose.Personalization]: Consent.Denied,
        [TrackingPurpose.AdPartners]: Consent.Given,
      })
    })

    it('[personalization + analytics] updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.onTogglePersonalization())
      act(() => result.current.onToggleProductAnalytics())
      act(() => result.current.acceptMyChoices())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Denied,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_options_accepted_analytics_personalization')
      expect(onFinish).toHaveBeenCalled()
    })

    it('[personalization + ad partners] updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.onTogglePersonalization())
      act(() => result.current.onToggleAdPartnerAnalytics())
      act(() => result.current.acceptMyChoices())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Denied,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Given,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_options_accepted_personalization_ad_partners')
      expect(onFinish).toHaveBeenCalled()
    })
    it('[analytics + ad partners] updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.onToggleProductAnalytics())
      act(() => result.current.onToggleAdPartnerAnalytics())
      act(() => result.current.acceptMyChoices())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Denied,
        [TrackingPurpose.AdPartners]: Consent.Given,
      })
      expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_options_accepted_analytics_ad_partners')
      expect(onFinish).toHaveBeenCalled()
    })

    it('[personalization + analytics + ad partners] updates consent state and calls hooks', async () => {
      const { result } = renderHook(() => useConsentModalState(onFinish))

      act(() => result.current.onTogglePersonalization())
      act(() => result.current.onToggleProductAnalytics())
      act(() => result.current.onToggleAdPartnerAnalytics())
      act(() => result.current.acceptMyChoices())

      expect(mockUpdateConsentState).toHaveBeenCalledWith({
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Given,
        [TrackingPurpose.AdPartners]: Consent.Given,
      })
      expect(mockAnonCount).toHaveBeenCalledWith(
        'tracking_consent_modal_options_accepted_analytics_personalization_ad_partners'
      )
      expect(onFinish).toHaveBeenCalled()
    })
  })
})
