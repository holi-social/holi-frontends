import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

import { AccountSetupStepper } from '@holi/core/screens/onboarding/components/AccountSetupStepper'

jest.useFakeTimers()

describe('AccountSetupStepper', () => {
  it('should call callback when selecting content type', async () => {
    const onContentSelection = jest.fn()
    const user = userEvent.setup()
    render(<AccountSetupStepper onContentSelection={onContentSelection} onFinish={jest.fn()} />)

    expect(screen.queryByText('onboarding.contentSelection.VOLUNTEERING')).toBeOnTheScreen()
    await user.press(screen.getByText('onboarding.contentSelection.VOLUNTEERING'))

    expect(screen.queryByText('onboarding.accountSetup.continue')).toBeEnabled()
    await user.press(screen.getByText('onboarding.accountSetup.continue'))

    expect(onContentSelection).toHaveBeenCalledWith('VOLUNTEERING')
  })

  it('should call onFinish callback when selecting content type', async () => {
    const onFinish = jest.fn()
    const user = userEvent.setup()
    render(<AccountSetupStepper onContentSelection={jest.fn()} onFinish={onFinish} />)

    expect(screen.queryByText('onboarding.contentSelection.VOLUNTEERING')).toBeOnTheScreen()
    await user.press(screen.getByText('onboarding.contentSelection.VOLUNTEERING'))

    expect(screen.queryByText('onboarding.accountSetup.continue')).toBeEnabled()
    await user.press(screen.getByText('onboarding.accountSetup.continue'))

    expect(onFinish).toHaveBeenCalled()
  })

  it('should call onFinish callback when skipping content selection', async () => {
    const onFinish = jest.fn()
    const user = userEvent.setup()
    render(<AccountSetupStepper onContentSelection={jest.fn()} onFinish={onFinish} />)

    await user.press(screen.getByTestId('holi-wizard-skip-btn'))

    expect(onFinish).toHaveBeenCalled()
  })
})
