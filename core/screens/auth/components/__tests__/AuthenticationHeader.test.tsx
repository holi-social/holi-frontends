import React from 'react'
import { AuthenticationHeader } from '@holi/core/screens/auth/components/AuthenticationHeader'
import { render, screen } from '@testing-library/react-native'

describe('AuthenticationHeader', () => {
  it('should render correct header for code step', () => {
    render(<AuthenticationHeader authenticationStep="code" />)

    expect(screen.getByText('registration.emailVerification.heading')).toBeOnTheScreen()
    expect(screen.getByText('registration.emailVerification.body')).toBeOnTheScreen()
  })

  it('should render correct header for other steps', () => {
    render(<AuthenticationHeader authenticationStep="oidc" />)

    expect(screen.getByText('registration.signUp.heading')).toBeOnTheScreen()
  })
})
