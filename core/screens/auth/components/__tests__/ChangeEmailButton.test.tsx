import React from 'react'
import { ChangeEmailButton } from '@holi/core/screens/auth/components/ChangeEmailButton'
import { TrackingEvent } from '@holi/core/tracking'
import { render, screen, userEvent } from '@testing-library/react-native'

describe('ChangeEmailButton', () => {
  it('should render current e-mail address', () => {
    const email = 'foo@bar.com'
    render(<ChangeEmailButton email={email} onChangeEmail={jest.fn()} trackingScreenName="mainLogin" />)

    expect(screen.getByText(email)).toBeOnTheScreen()
  })

  it('should call callback on e-mail change request', async () => {
    const onChangeEmail = jest.fn()
    const user = userEvent.setup()

    render(<ChangeEmailButton email="" onChangeEmail={onChangeEmail} trackingScreenName="mainLogin" />)

    await user.press(screen.getByLabelText('global.edit'))

    expect(onChangeEmail).toHaveBeenCalled()
  })

  it('should track e-mail change request for login', async () => {
    const user = userEvent.setup()

    render(<ChangeEmailButton email="" onChangeEmail={jest.fn()} trackingScreenName="mainLogin" />)

    await user.press(screen.getByLabelText('global.edit'))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.Auth.OneTimeCodePressed({
        step: 'edit',
        screen: 'mainLogin',
      })
    )
  })

  it('should track e-mail change request for registration', async () => {
    const user = userEvent.setup()

    render(<ChangeEmailButton email="" onChangeEmail={jest.fn()} trackingScreenName="mainRegistration" />)

    await user.press(screen.getByLabelText('global.edit'))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.Auth.OneTimeCodePressed({
        step: 'edit',
        screen: 'mainRegistration',
      })
    )
  })
})
