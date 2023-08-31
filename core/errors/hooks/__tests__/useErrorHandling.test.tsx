/* eslint-disable no-console */
import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

jest.unmock('@holi/ui/components/molecules/HoliToastProvider')

const mockConsoleWarn = jest.fn()
const mockConsoleError = jest.fn()

global.console.warn = mockConsoleWarn
global.console.error = mockConsoleError

type ErrorComponentProps = { message?: string }

const ErrorComponent: React.VFC<ErrorComponentProps> = ({ message }) => {
  const { displayError } = useErrorHandling()

  displayError(new HoliError('Test Error'), message)

  return <Text>Child Content</Text>
}

describe('displays errors correctly', () => {
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
        <ErrorComponent message="Custom Error" />
      </ToastProvider>
    )

    expect(await screen.findByText('Custom Error'))
  })

  it('warn logs and tracks error with sentry in development', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    render(
      <ToastProvider>
        <ErrorComponent message="Custom Error" />
      </ToastProvider>
    )

    expect(console.error).toHaveBeenCalledWith('[logError.ts] Custom Error:', new HoliError('Test Error'), undefined)
    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test Error'), expect.any(Function))
  })

  it('warn logs and tracks error with sentry in production', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'production'
    render(
      <ToastProvider>
        <ErrorComponent message="Custom Error" />
      </ToastProvider>
    )

    expect(console.warn).toHaveBeenCalledWith('[logError.ts] Custom Error:', new HoliError('Test Error'), undefined)
    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test Error'), expect.any(Function))
  })
})
