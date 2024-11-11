import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import OnboardingAccountSetup from '@holi/core/screens/onboarding/OnboardingAccountSetup'

jest.useFakeTimers()

const mockUseFirstVisitContentSelection = jest.fn()
jest.mock('@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection', () => ({
  useFirstVisitContentSelection: () => mockUseFirstVisitContentSelection(),
}))

const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

const mockStoreOnboardingState = jest.fn()
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  storeOnboardingState: (value: string) => mockStoreOnboardingState(value),
}))

describe('OnboardingAccountSetup', () => {
  const mockSelectContentType = jest.fn()

  beforeEach(() => {
    mockStoreOnboardingState.mockResolvedValue({})
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: false })
    mockUseFirstVisitContentSelection.mockReturnValue({
      selectedContentType: undefined,
      selectContentType: mockSelectContentType,
    })
  })

  it('should navigate back on first screen', () => {
    render(<OnboardingAccountSetup />)

    fireEvent.press(screen.getByTestId('holi-wizard-back-btn'))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should skip whole flow', async () => {
    render(<OnboardingAccountSetup />)

    fireEvent.press(screen.getByTestId('holi-wizard-skip-btn'))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })

  it('should set onboarding state to finished when skipping the flow', () => {
    render(<OnboardingAccountSetup />)

    fireEvent.press(screen.getByTestId('holi-wizard-skip-btn'))

    expect(mockStoreOnboardingState).toHaveBeenCalledWith('finished')
  })

  it('should store selected content', async () => {
    render(<OnboardingAccountSetup />)

    await act(async () => {
      await waitFor(() => expect(screen.getByText('onboarding.contentSelection.CHALLENGES')).toBeOnTheScreen())
      fireEvent.press(screen.getByText('onboarding.contentSelection.CHALLENGES'))

      await waitFor(() => expect(screen.getByText('onboarding.accountSetup.continue')).toBeEnabled())
      fireEvent.press(screen.getByText('onboarding.accountSetup.continue'))
    })

    expect(mockSelectContentType).toHaveBeenCalledWith('CHALLENGES')
  })

  const testCasesRoutes = [
    { contentType: 'CHALLENGES', expectedRoute: '/act' },
    { contentType: 'DONATIONS', expectedRoute: '/act' },
    { contentType: 'VOLUNTEERING', expectedRoute: '/act' },
    { contentType: 'SPACES', expectedRoute: '/spaces' },
    { contentType: 'HOME', expectedRoute: '/' },
  ]
  it.each(testCasesRoutes)(
    'should navigate to route $expectedRoute for content type $contentType',
    async ({ contentType, expectedRoute }) => {
      mockUseFirstVisitContentSelection.mockReturnValue({
        selectedContentType: contentType,
        selectContentType: jest.fn(),
      })
      render(<OnboardingAccountSetup />)

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(expectedRoute))
    }
  )

  it('should set onboarding state to finished on content selection', () => {
    mockUseFirstVisitContentSelection.mockReturnValue({
      selectedContentType: 'SPACES',
      selectContentType: jest.fn(),
    })
    render(<OnboardingAccountSetup />)

    expect(mockStoreOnboardingState).toHaveBeenCalledWith('finished')
  })

  it('should navigate to home screen for invalid content type', async () => {
    mockUseFirstVisitContentSelection.mockReturnValue({
      selectedContentType: 'FOOBAR',
      selectContentType: jest.fn(),
    })
    render(<OnboardingAccountSetup />)

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })

  it('should navigate to home screen if user is already logged in', () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true })
    render(<OnboardingAccountSetup />)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
