import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

import { AccountSetupStepper } from '@holi/core/screens/onboarding/components/AccountSetupStepper'

jest.useFakeTimers()

describe('AccountSetupStepper', () => {
  it('should call callback when selecting content type', async () => {
    const onContentSelection = jest.fn()
    const user = userEvent.setup()
    render(<AccountSetupStepper onContentSelection={onContentSelection} />)

    expect(screen.queryByText('onboarding.contentSelection.VOLUNTEERING')).toBeOnTheScreen()
    await user.press(screen.getByText('onboarding.contentSelection.VOLUNTEERING'))

    expect(screen.queryByText('onboarding.accountSetup.continue')).toBeEnabled()
    await user.press(screen.getByText('onboarding.accountSetup.continue'))

    expect(onContentSelection).toHaveBeenCalledWith('VOLUNTEERING')
  })
})
