/* eslint-disable no-console */
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

type ErrorComponentProps = { message?: string }

const ErrorComponent: React.VFC<ErrorComponentProps> = ({ message }) => {
  const { displayError } = useErrorHandling()

  displayError(new Error('Test Error'), message)

  return <Text>Child Content</Text>
}

describe('displays errors correctly', () => {
  it('displays toast with global error message', () => {
    render(
      <ToastProvider>
        <ErrorComponent />
      </ToastProvider>
    )

    screen.findByText('global.technicalError')
  })

  it('displays toast with custom error message', () => {
    render(
      <ToastProvider>
        <ErrorComponent message="Custom Error" />
      </ToastProvider>
    )

    screen.findByText('Custom Error')
  })

  it('warn logs and tracks error with sentry in development', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    render(
      <ToastProvider>
        <ErrorComponent message="Custom Error" />
      </ToastProvider>
    )

    expect(console.error).toHaveBeenCalledWith('[logError.ts] Custom Error:', new Error('Test Error'), undefined)
    expect(captureSentryException).toHaveBeenCalledWith(new Error('Test Error'))
  })

  it('warn logs and tracks error with sentry in production', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'production'
    render(
      <ToastProvider>
        <ErrorComponent message="Custom Error" />
      </ToastProvider>
    )

    expect(console.warn).toHaveBeenCalledWith('[logError.ts] Custom Error:', new Error('Test Error'), undefined)
    expect(captureSentryException).toHaveBeenCalledWith(new Error('Test Error'))
  })
})
