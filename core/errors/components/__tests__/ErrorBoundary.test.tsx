/* eslint-disable no-console */
import { fireEvent, render } from '@testing-library/react-native'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'

type ErrorComponentProps = {
  throwError?: boolean
}

const ErrorComponent: React.VFC<ErrorComponentProps> = ({ throwError = true }) => {
  if (throwError) {
    throw new HoliError('Test')
  }

  return <Text>Child Content</Text>
}

const ErrorOnFirstRenderComponent = () => {
  const [firstRender, setFirstRender] = useState(true)
  useEffect(() => {
    setFirstRender(false)
  }, [])

  return (
    <ErrorBoundary>
      <ErrorComponent throwError={firstRender} />
    </ErrorBoundary>
  )
}

describe('renders correctly', () => {
  it('renders child components without error', () => {
    const { queryByText } = render(
      <ErrorBoundary>
        <Text>Child Content</Text>
      </ErrorBoundary>
    )

    expect(queryByText('Child Content')).toBeTruthy()
    expect(queryByText('global.technicalError')).toBeFalsy()
    expect(queryByText('error.errorBoundary.retry')).toBeFalsy()
  })

  it('renders fallback content when rendering child content failed', () => {
    const { queryByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(queryByText('global.technicalError')).toBeTruthy()
    expect(queryByText('error.errorBoundary.retry')).toBeTruthy()
    expect(queryByText('Child Content')).toBeFalsy()
  })

  it('warn logs and tracks error with sentry in production', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(console.warn).toHaveBeenCalledWith(
      '[logError.ts] [ErrorBoundary.tsx]:',
      new HoliError('Test'),
      expect.any(String)
    )
    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test'))
  })

  it('logs and tracks error with sentry', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(console.error).toHaveBeenCalledWith(
      '[logError.ts] [ErrorBoundary.tsx]:',
      new HoliError('Test'),
      expect.any(String)
    )
    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test'))
  })

  it('resets error to retry rendering', async () => {
    const { getByText, queryByText } = render(<ErrorOnFirstRenderComponent />)

    await fireEvent.press(getByText('error.errorBoundary.retry'))

    expect(queryByText('Child Content')).toBeTruthy()
    expect(queryByText('global.technicalError')).toBeFalsy()
    expect(queryByText('error.errorBoundary.retry')).toBeFalsy()
  })
})
