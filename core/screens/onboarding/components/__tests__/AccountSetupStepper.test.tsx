import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { AccountSetupStepper } from '@holi/core/screens/onboarding/components/AccountSetupStepper'

jest.useFakeTimers()

describe('AccountSetupStepper', () => {
  it('should call callback when selecting content type', async () => {
    const onContentSelection = jest.fn()
    render(<AccountSetupStepper onContentSelection={onContentSelection} />)

    await act(async () => {
      await waitFor(() => expect(screen.getByText('onboarding.contentSelection.VOLUNTEERING')).toBeOnTheScreen())
      fireEvent.press(screen.getByText('onboarding.contentSelection.VOLUNTEERING'))

      await waitFor(() => expect(screen.getByText('onboarding.accountSetup.continue')).toBeEnabled())
      fireEvent.press(screen.getByText('onboarding.accountSetup.continue'))
    })

    expect(onContentSelection).toHaveBeenCalledWith('VOLUNTEERING')
  })
})
