import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { OAuth2Logout } from '@holi/core/auth/screens/OAuth2Logout'

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

describe('OAuth2Logout', () => {
  const displayError = jest.fn()

  beforeEach(() => {
    mockUseErrorHandling.mockReturnValue({ displayError })
  })

  it('should render and display error', () => {
    render(<OAuth2Logout error="test" />)

    expect(screen.getByText('oauth2.redirect.error')).toBeOnTheScreen()
    expect(displayError).toHaveBeenCalled()
  })

  it('should render redirecting info if there was no error', () => {
    render(<OAuth2Logout />)

    expect(screen.getByText('oauth2.redirecting')).toBeOnTheScreen()
  })
})
