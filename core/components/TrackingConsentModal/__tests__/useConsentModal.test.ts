import { useIsFocused } from '@holi/core/helpers/useIsFocused'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { useAnonCount } from '@holi/core/domain/shared/hooks'
import { Consent, ConsentState, TrackingPurpose } from '@holi/core/tracking/types'
import { act, renderHook } from '@testing-library/react-native'
import { useConsentModal } from '@holi/core/components/TrackingConsentModal/useConsentModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

jest.mock('@holi/core/helpers/useIsFocused')
const mockUseIsFocused = jest.mocked(useIsFocused)

jest.mock('@holi/core/tracking/TrackingInitializer')
const mockUseConsentState = jest.mocked(useConsentState)

jest.mock('@holi/core/domain/shared/hooks')
const mockAnonCount = jest.fn<void, [string]>()
const mockUseAnonCount = jest.mocked(useAnonCount)

jest.mock('@holi/ui/components/molecules/HoliModal')
const mockModalStateShow = jest.fn()
const mockModalStateHide = jest.fn()
const mockUseModalState = jest.mocked(useModalState)

const randomConsent = () => (Math.random() > 0.5 ? Consent.Given : Consent.Denied)
const randomKnownConsentState = () => ({
  [TrackingPurpose.Analytics]: randomConsent(),
  [TrackingPurpose.AdPartners]: randomConsent(),
  [TrackingPurpose.Personalization]: randomConsent(),
})

describe('useConsentModal', () => {
  beforeEach(() => {
    jest.useFakeTimers()

    mockUseAnonCount.mockReturnValue(mockAnonCount)
    mockUseModalState.mockImplementation(() => ({
      show: mockModalStateShow,
      hide: mockModalStateHide,
      visible: false,
      props: {
        onDismiss: jest.fn(),
        shown: false,
      },
    }))
  })
  afterEach(() => {
    act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })
  it('calls anonymously counts the times the modal is opened when opened', async () => {
    mockUseIsFocused.mockReturnValue(true)
    mockUseConsentState.mockReturnValue([ConsentState.unknown, { loading: false }])

    renderHook(useConsentModal)
    act(jest.runAllTimers)

    expect(mockModalStateShow).toHaveBeenCalled()
    expect(mockAnonCount).toHaveBeenCalledWith('tracking_consent_modal_shown')
  })
  it('does not show and not anonymously count when is not focused', async () => {
    mockUseIsFocused.mockReturnValue(false)
    mockUseConsentState.mockReturnValue([ConsentState.unknown, { loading: false }])

    renderHook(useConsentModal)
    act(jest.runAllTimers)

    expect(mockModalStateShow).not.toHaveBeenCalled()
    expect(mockAnonCount).not.toHaveBeenCalledWith('tracking_consent_modal_shown')
  })
  it('does not show and not anonymously count when consent state is known', async () => {
    mockUseIsFocused.mockReturnValue(true)
    mockUseConsentState.mockReturnValue([randomKnownConsentState(), { loading: false }])

    renderHook(useConsentModal)
    act(jest.runAllTimers)

    expect(mockModalStateShow).not.toHaveBeenCalled()
    expect(mockAnonCount).not.toHaveBeenCalledWith('tracking_consent_modal_shown')
  })
})
