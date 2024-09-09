import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import OnboardingFirstVisit from '@holi/core/screens/onboarding/OnboardingFirstVisit'

jest.useFakeTimers()

describe('OnboardingFirstVisit', () => {
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
})
