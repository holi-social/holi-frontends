/* eslint-disable no-console */
import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

jest.unmock('@holi/ui/components/molecules/HoliToastProvider')

const mockConsoleWarn = jest.fn()
const mockConsoleError = jest.fn()

global.console.warn = mockConsoleWarn
global.console.error = mockConsoleError

type ErrorComponentProps = { displayMessage?: string }

const ErrorComponent: React.FC<ErrorComponentProps> = ({ displayMessage }) => {
  const { displayError } = useErrorHandling()

  displayError(new HoliError('Test Error'), 'Test Error', {
    displayMessage,
    location: 'ErrorComponent',
  })

  return <Text>Child Content</Text>
}

describe('useErrorHandling', () => {
  it('displays toast with global error message', async () => {
    render(
      <ToastProvider>
        <ErrorComponent />
      </ToastProvider>
    )

    expect(await screen.findByText('global.technicalError'))
  })

  it('displays toast with custom error message', async () => {
    render(
      <ToastProvider>
        <ErrorComponent displayMessage="Custom Error" />
      </ToastProvider>
    )

    expect(await screen.findByText('Custom Error'))
  })

  it('warn logs and tracks error with sentry in development', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    render(
      <ToastProvider>
        <ErrorComponent displayMessage="Custom Error" />
      </ToastProvider>
    )

    expect(console.error).toHaveBeenCalledWith('[ErrorComponent] Test Error', new HoliError('Test Error'), {})
    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test Error'), expect.any(Function))
  })

  it('warn logs and tracks error with sentry in production', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'production'
    render(
      <ToastProvider>
        <ErrorComponent displayMessage="Custom Error" />
      </ToastProvider>
    )

    expect(console.warn).toHaveBeenCalledWith('[ErrorComponent] Test Error', new HoliError('Test Error'), {})
    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test Error'), expect.any(Function))
  })
})
