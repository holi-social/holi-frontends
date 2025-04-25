import React from 'react'
import { OAuth2Consent } from '@holi/core/auth/screens/OAuth2Consent'
import { render, screen } from '@testing-library/react-native'
import { useErrorHandling } from '@holi/core/errors/hooks'

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

describe('OAuth2Consent', () => {
  const displayError = jest.fn()

  beforeEach(() => {
    mockUseErrorHandling.mockReturnValue({ displayError })
  })

  it('should render and display error', () => {
    render(<OAuth2Consent error="test" />)

    expect(screen.getByText('oauth2.redirect.error')).toBeOnTheScreen()
    expect(displayError).toHaveBeenCalled()
  })

  it('should render redirecting info if there was no error', () => {
    render(<OAuth2Consent />)

    expect(screen.getByText('oauth2.redirecting')).toBeOnTheScreen()
  })
})
