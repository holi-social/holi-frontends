import { render } from '@testing-library/react-native'
import React from 'react'
import { Alert, Text } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'

jest.spyOn(Alert, 'alert')

const ErrorComponent: React.VFC = () => {
  displayError(new Error('Test'), 'An error occurred')

  return <Text>Child Content</Text>
}

describe('displays errors correctly', () => {
  it('displays alert with error message', () => {
    render(<ErrorComponent />)

    expect(Alert.alert).toHaveBeenCalledWith('error.alert.title', 'An error occurred: Test', expect.any(Array))
  })

  it('logs displayed errors', () => {
    render(<ErrorComponent />)

    expect(console.error).toHaveBeenCalledWith('[logError.ts] An error occurred:', new Error('Test'), undefined)
    expect(captureSentryException).toHaveBeenCalledWith(new Error('Test'))
  })
})
