import React from 'react'
import { OAuth2Redirect } from '@holi/core/auth/screens/OAuth2Redirect'
import { render, screen } from '@testing-library/react-native'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliError } from '@holi/core/errors/classes/HoliError'

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

describe('OAuth2Redirect', () => {
  const displayError = jest.fn()

  beforeEach(() => {
    mockUseErrorHandling.mockReturnValue({ displayError })
  })

  it('should render error', () => {
    render(<OAuth2Redirect error="test" />)

    expect(screen.getByText('oauth2.redirect.error')).toBeOnTheScreen()
  })

  it('should display error', () => {
    render(<OAuth2Redirect error="test" errorContext={{ location: 'somewhere', foo: 'bar' }} />)

    expect(displayError).toHaveBeenCalledWith(new HoliError('test'), 'Error during OAuth2 flow', {
      location: 'somewhere',
      foo: 'bar',
    })
  })

  it('should render redirecting info if there was no error', () => {
    render(<OAuth2Redirect />)

    expect(screen.getByText('oauth2.redirecting')).toBeOnTheScreen()
  })
})
