import { useDocumentModal } from '@holi/core/screens/onboarding/components/DocumentModal'
import { OnboardingFinishModal } from '@holi/core/screens/onboarding/components/OnboardingFinishModal'
import { useOnboardingFinishModalState } from '@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState'
import { act, render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

const mockUseOnboardingFinishModalState = useOnboardingFinishModalState as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState', () => ({
  useOnboardingFinishModalState: jest.fn(),
}))

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => ({ user: {} }),
}))

const mockUseDocumentModal = useDocumentModal as jest.Mock
jest.mock('@holi/core/screens/onboarding/components/DocumentModal', () => {
  const original = jest.requireActual('@holi/core/screens/onboarding/components/DocumentModal')
  return {
    ...original,
    useDocumentModal: jest.fn(),
  }
})

describe('OnboardingFinishModal', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseOnboardingFinishModalState.mockReturnValue({ visible: true, hide: jest.fn() })
    mockUseDocumentModal.mockReturnValue({ show: false, modalProps: {} })
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('should render nothing if not visible', () => {
    mockUseOnboardingFinishModalState.mockReturnValue({ visible: false, hide: jest.fn() })

    render(<OnboardingFinishModal />)

    expect(screen.queryByText('onboarding.communityGuidelines.heading')).not.toBeOnTheScreen()
  })

  it('should render modal if visible', () => {
    render(<OnboardingFinishModal />)

    expect(screen.getByText('onboarding.communityGuidelines.heading')).toBeOnTheScreen()
  })

  it('should render link to modal with community guidelines', async () => {
    const showDocModal = jest.fn()
    mockUseDocumentModal.mockReturnValue({ show: showDocModal, modalProps: {} })
    const user = userEvent.setup()

    render(<OnboardingFinishModal />)

    await user.press(screen.getByRole('link'))

    expect(showDocModal).toHaveBeenCalledWith('communityGuidelines')
  })

  it('should close modal on dismiss', async () => {
    const hideModal = jest.fn()
    mockUseOnboardingFinishModalState.mockReturnValue({ visible: true, hide: hideModal })
    const user = userEvent.setup()

    render(<OnboardingFinishModal />)

    await user.press(screen.getByText('onboarding.communityGuidelines.acceptButton'))

    expect(hideModal).toHaveBeenCalled()
  })
})
