import React from 'react'
import { LoginCallback } from '@holi/core/auth/screens/LoginCallback'
import { render, screen } from '@testing-library/react-native'
import * as WebBrowser from 'expo-web-browser'

const mockedBrowser = jest.mocked(WebBrowser)
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}))

describe('LoginCallback', () => {
  it('should render loader', () => {
    render(<LoginCallback />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('should complete browser auth session', () => {
    render(<LoginCallback />)

    expect(mockedBrowser.maybeCompleteAuthSession).toHaveBeenCalledWith({
      skipRedirectCheck: false,
    })
  })
})
