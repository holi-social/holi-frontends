import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import OnboardingFirstVisit from '@holi/core/screens/onboarding/OnboardingFirstVisit'
import { selectWizardOptions } from '@holi/core/screens/onboarding/components/__tests__/FirstVisitOnboardingStepper.test'

jest.useFakeTimers()

const mockUseFirstVisitContentSelection = jest.fn()
jest.mock('@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection', () => ({
  useFirstVisitContentSelection: () => mockUseFirstVisitContentSelection(),
}))

describe('OnboardingFirstVisit', () => {
  const mockSelectContentType = jest.fn()

  beforeEach(() => {
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

  it('should skip whole flow', () => {
    render(<OnboardingFirstVisit />)

    fireEvent.press(screen.getByTestId('holi-wizard-skip-btn'))

    expect(mockNavigate).toHaveBeenCalledWith('/')
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
    ({ contentType, expectedRoute }) => {
      mockUseFirstVisitContentSelection.mockReturnValue({
        selectedContentType: contentType,
        selectContentType: jest.fn(),
      })
      render(<OnboardingFirstVisit />)

      expect(mockNavigate).toHaveBeenCalledWith(expectedRoute)
    }
  )

  it('should navigate to home screen for invalid content type', () => {
    mockUseFirstVisitContentSelection.mockReturnValue({
      selectedContentType: 'FOOBAR',
      selectContentType: jest.fn(),
    })
    render(<OnboardingFirstVisit />)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
