import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'

type ErrorComponentProps = {
  throwError?: boolean
}

const mockConsoleWarn = jest.fn()
const mockConsoleError = jest.fn()

global.console.warn = mockConsoleWarn
global.console.error = mockConsoleError

const ErrorComponent: React.FC<ErrorComponentProps> = ({ throwError = true }) => {
  if (throwError) {
    throw new HoliError('Test')
  }

  return <Text>Child Content</Text>
}

describe('ErrorBoundary', () => {
  it('renders child components without error', () => {
    const { queryByText } = render(
      <ErrorBoundary>
        <Text>Child Content</Text>
      </ErrorBoundary>
    )

    expect(queryByText('Child Content')).toBeTruthy()
    expect(queryByText('global.technicalError')).toBeFalsy()
  })

  it('renders fallback content when rendering child content failed', () => {
    const { queryByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(queryByText('global.technicalError')).toBeTruthy()
    expect(queryByText('Child Content')).toBeFalsy()
  })

  it('warn logs and tracks error with sentry in production', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(mockConsoleWarn).toHaveBeenCalledWith(
      '[ErrorBoundary.componentDidCatch] Failed to render component',
      new HoliError('Test'),
      { componentStack: expect.any(String) }
    )
    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test'), expect.any(Function))
  })

  it('logs and tracks error with sentry', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(mockConsoleError).toHaveBeenCalledWith(
      '[ErrorBoundary.componentDidCatch] Failed to render component',
      new HoliError('Test'),
      { componentStack: expect.any(String) }
    )
    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test'), expect.any(Function))
  })
})
