import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

import OnboardingAccountSetup from '@holi/core/screens/onboarding/OnboardingAccountSetup'
import type { UserEventInstance } from '@testing-library/react-native/build/user-event/setup'

jest.useFakeTimers()

const mockUseFirstVisitContentSelection = jest.fn()
jest.mock('@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection', () => ({
  useFirstVisitContentSelection: () => mockUseFirstVisitContentSelection(),
}))

const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

describe('OnboardingAccountSetup', () => {
  const mockSelectContentType = jest.fn()
  let user: UserEventInstance

  beforeEach(() => {
    user = userEvent.setup()
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: false })
    mockUseFirstVisitContentSelection.mockReturnValue({
      selectedContentType: undefined,
      selectContentType: mockSelectContentType,
    })
  })

  it('should navigate back on first screen', async () => {
    render(<OnboardingAccountSetup />)

    await user.press(screen.getByTestId('holi-wizard-back-btn'))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should navigate to registration when skipping the flow', async () => {
    render(<OnboardingAccountSetup />)

    await user.press(screen.getByTestId('holi-wizard-skip-btn'))

    expect(mockNavigate).toHaveBeenCalledWith('/onboarding/registration')
  })

  it('should store selected content', async () => {
    render(<OnboardingAccountSetup />)

    expect(screen.queryByText('onboarding.contentSelection.CHALLENGES')).toBeOnTheScreen()
    await user.press(screen.getByText('onboarding.contentSelection.CHALLENGES'))

    expect(screen.queryByText('onboarding.accountSetup.continue')).toBeEnabled()
    await user.press(screen.getByText('onboarding.accountSetup.continue'))

    expect(mockSelectContentType).toHaveBeenCalledWith('CHALLENGES')
  })

  it('should navigate to registration after content selection', async () => {
    mockUseFirstVisitContentSelection.mockReturnValue({
      selectedContentType: 'SPACES',
      selectContentType: jest.fn(),
    })
    render(<OnboardingAccountSetup />)

    expect(screen.queryByText('onboarding.contentSelection.CHALLENGES')).toBeOnTheScreen()
    await user.press(screen.getByText('onboarding.contentSelection.CHALLENGES'))

    expect(screen.queryByText('onboarding.accountSetup.continue')).toBeEnabled()
    await user.press(screen.getByText('onboarding.accountSetup.continue'))

    expect(mockNavigate).toHaveBeenCalledWith('/onboarding/registration')
  })

  it('should navigate to home screen if user is already logged in', () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true })
    render(<OnboardingAccountSetup />)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
