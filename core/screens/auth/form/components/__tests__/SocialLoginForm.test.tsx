import React from 'react'
import { SocialLoginForm } from '@holi/core/screens/auth/form/components/SocialLoginForm'
import { render, userEvent, screen } from '@testing-library/react-native'

describe('SocialLoginForm', () => {
  it('should render two social login buttons', () => {
    render(<SocialLoginForm onSubmit={jest.fn()} />)

    expect(screen.getAllByLabelText('auth.login.input.label-ProviderSignIn')).toHaveLength(2)
  })

  it('should allow Apple login', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()

    render(<SocialLoginForm onSubmit={onSubmit} />)

    // Apple should be first button
    await user.press(screen.getAllByLabelText('auth.login.input.label-ProviderSignIn')[0])

    expect(onSubmit).toHaveBeenCalledWith('Apple')
  })

  it('should allow Google login', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()

    render(<SocialLoginForm onSubmit={onSubmit} />)

    // Google should be second button
    await user.press(screen.getAllByLabelText('auth.login.input.label-ProviderSignIn')[1])

    expect(onSubmit).toHaveBeenCalledWith('Google')
  })
})
