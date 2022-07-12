import { render } from '@testing-library/react-native'
import React from 'react'
import { Alert, Text } from 'react-native'

import useErrorHandling, { logError } from '@holi/core/errors/useErrorHandling'

jest.spyOn(Alert, 'alert')

const ErrorComponent: React.VFC = () => {
  const { displayError } = useErrorHandling()
  displayError(new Error('Test'), 'An error occurred')

  return <Text>Child Content</Text>
}

describe('handles errors correctly', () => {
  it('logs and tracks error with sentry', () => {
    logError(new Error('Test'), 'some message', 'some stack')

    expect(console.error).toHaveBeenCalledWith('[useErrorHandling.ts] some message:', new Error('Test'), 'some stack')
    expect(captureSentryException).toHaveBeenCalledWith(new Error('Test'))
  })

  it('displays alert with error message', () => {
    render(<ErrorComponent />)

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'An error occurred: Test', expect.any(Array))
  })

  it('logs displayed errors', () => {
    render(<ErrorComponent />)

    expect(console.error).toHaveBeenCalledWith('[useErrorHandling.ts] An error occurred:', new Error('Test'), undefined)
    expect(captureSentryException).toHaveBeenCalledWith(new Error('Test'))
  })
})
