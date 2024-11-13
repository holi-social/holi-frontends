import { render, screen, userEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { AccountSetupStepper } from '@holi/core/screens/onboarding/components/AccountSetupStepper'

jest.useFakeTimers()

describe('AccountSetupStepper', () => {
  it('should call callback when selecting content type', async () => {
    const onContentSelection = jest.fn()
    const user = userEvent.setup()
    render(<AccountSetupStepper onContentSelection={onContentSelection} />)

    await waitFor(() => expect(screen.getByText('onboarding.contentSelection.VOLUNTEERING')).toBeOnTheScreen())
    await user.press(screen.getByText('onboarding.contentSelection.VOLUNTEERING'))

    await waitFor(() => expect(screen.getByText('onboarding.accountSetup.continue')).toBeEnabled())
    await user.press(screen.getByText('onboarding.accountSetup.continue'))

    expect(onContentSelection).toHaveBeenCalledWith('VOLUNTEERING')
  })
})
