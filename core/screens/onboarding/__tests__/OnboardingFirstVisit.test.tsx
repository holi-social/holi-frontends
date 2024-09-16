import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import OnboardingFirstVisit from '@holi/core/screens/onboarding/OnboardingFirstVisit'
import { selectWizardOptions } from '@holi/core/screens/onboarding/components/__tests__/FirstVisitOnboardingStepper.test'

jest.useFakeTimers()

const mockUseFirstVisitContentSelection = jest.fn()
jest.mock('@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection', () => ({
  useFirstVisitContentSelection: () => mockUseFirstVisitContentSelection(),
}))

const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

const mockStoreOnboardingState = jest.fn()
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  storeOnboardingState: (value: string) => mockStoreOnboardingState(value),
}))

describe('OnboardingFirstVisit', () => {
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
    render(<OnboardingFirstVisit />)

    fireEvent.press(screen.getByTestId('holi-wizard-back-btn'))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should navigate back to previous step', () => {
    render(<OnboardingFirstVisit />)

    // Select first option and continue
    fireEvent.press(screen.getByTestId('option-ALREADY_VOLUNTEERING'))
    fireEvent.press(screen.getByTestId('holi-wizard-save-btn'))

    // Expect second step
    expect(screen.findByText('onboarding.firstVisit.ALREADY_VOLUNTEERING.heading')).toBeTruthy()

    // Navigate back to previous step
    fireEvent.press(screen.getByTestId('holi-wizard-back-btn'))

    // Expect first step
    expect(screen.findByText('onboarding.firstVisit.INITIAL_QUESTION.heading')).toBeTruthy()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should skip whole flow', async () => {
    render(<OnboardingFirstVisit />)

    fireEvent.press(screen.getByTestId('holi-wizard-skip-btn'))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })

  it('should set onboarding state to finished when skipping the flow', () => {
    render(<OnboardingFirstVisit />)

    fireEvent.press(screen.getByTestId('holi-wizard-skip-btn'))

    expect(mockStoreOnboardingState).toHaveBeenCalledWith('finished')
  })

  it('should store selected content', async () => {
    const options = ['ALREADY_VOLUNTEERING', 'SMALL_ACTIONS', 'CHALLENGES']

    render(<OnboardingFirstVisit />)

    await selectWizardOptions(options)

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
      render(<OnboardingFirstVisit />)

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(expectedRoute))
    }
  )

  it('should set onboarding state to finished on content selection', () => {
    mockUseFirstVisitContentSelection.mockReturnValue({
      selectedContentType: 'SPACES',
      selectContentType: jest.fn(),
    })
    render(<OnboardingFirstVisit />)

    expect(mockStoreOnboardingState).toHaveBeenCalledWith('finished')
  })

  it('should navigate to home screen for invalid content type', async () => {
    mockUseFirstVisitContentSelection.mockReturnValue({
      selectedContentType: 'FOOBAR',
      selectContentType: jest.fn(),
    })
    render(<OnboardingFirstVisit />)

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })

  it('should navigate to home screen if user is already logged in', () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true })
    render(<OnboardingFirstVisit />)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
