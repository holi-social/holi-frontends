import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { FirstVisitOnboardingStepper } from '@holi/core/screens/onboarding/components/FirstVisitOnboardingStepper'

jest.useFakeTimers()

export const selectWizardOptions = (options: string[]) =>
  act(async () => {
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

describe('FirstVisitOnboardingStepper', () => {
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
      render(<FirstVisitOnboardingStepper onContentSelection={onContentSelection} />)

      await selectWizardOptions(options)

      expect(onContentSelection).toHaveBeenCalledWith(expectedContentType)
    }
  )
})
