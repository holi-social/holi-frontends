import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import OnboardingFirstVisit, { OnboardingStepper } from '@holi/core/screens/onboarding/OnboardingFirstVisit'

jest.useFakeTimers()

describe('OnboardingFirstVisit', () => {
  const testCases = [
    {
      options: ['ALREADY_VOLUNTEERING', 'SMALL_ACTIONS', 'CHALLENGES'],
      expectedContentType: 'CHALLENGES',
    },
    {
      options: ['ALREADY_VOLUNTEERING', 'SMALL_ACTIONS', 'DISCUSS'],
      expectedContentType: 'HOME',
    },
    {
      options: ['ALREADY_VOLUNTEERING', 'SMALL_ACTIONS', 'DONATIONS'],
      expectedContentType: 'DONATIONS',
    },
    {
      options: ['ALREADY_VOLUNTEERING', 'SMALL_ACTIONS', 'SPACES'],
      expectedContentType: 'SPACES',
    },
    {
      options: ['ALREADY_VOLUNTEERING', 'COLLABORATION', 'SPACES'],
      expectedContentType: 'SPACES',
    },
    {
      options: ['ALREADY_VOLUNTEERING', 'COLLABORATION', 'FEED_POSTS'],
      expectedContentType: 'HOME',
    },
    {
      // Last step has no options, but requires pressing "continue"
      options: ['ALREADY_VOLUNTEERING', 'POSTS', ''],
      expectedContentType: 'HOME',
    },
    {
      options: ['ALREADY_VOLUNTEERING', 'EXPLORE'],
      expectedContentType: 'HOME',
    },
    {
      options: ['NOT_VOLUNTEERING', 'CHALLENGES'],
      expectedContentType: 'CHALLENGES',
    },
    {
      options: ['NOT_VOLUNTEERING', 'POSTS'],
      expectedContentType: 'HOME',
    },
    {
      options: ['NOT_VOLUNTEERING', 'DONATIONS'],
      expectedContentType: 'DONATIONS',
    },
    {
      options: ['NOT_VOLUNTEERING', 'VOLUNTEERING'],
      expectedContentType: 'VOLUNTEERING',
    },
  ]

  it.each(testCases)(
    'should navigate through wizard selecting $options for content type $expectedContentType',
    async ({ options, expectedContentType }) => {
      const onContentSelection = jest.fn()
      render(<OnboardingStepper onContentSelection={onContentSelection} />)

      await act(async () => {
        // Select options as listed and press continue
        for (const option of options) {
          if (option) {
            await waitFor(() => expect(screen.queryByTestId(`option-${option}`)).toBeTruthy())
            fireEvent.press(screen.getByTestId(`option-${option}`))
          }

          await waitFor(() => expect(screen.getByTestId('holi-wizard-save-btn')).toBeEnabled())
          fireEvent.press(screen.getByTestId('holi-wizard-save-btn'))
        }
      })

      expect(onContentSelection).toHaveBeenCalledWith(expectedContentType)
    }
  )

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
