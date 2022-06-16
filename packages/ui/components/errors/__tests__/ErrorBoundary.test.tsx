import { fireEvent, render } from '@testing-library/react-native'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'

import { ErrorBoundary } from '@holi/ui/components/errors/ErrorBoundary'

type ErrorComponentProps = {
  throwError?: boolean
}

const ErrorComponent: React.VFC<ErrorComponentProps> = ({ throwError = true }) => {
  if (throwError) {
    throw new Error('Test')
  }

  return <Text>Child Content</Text>
}

const ErrorOnFirstRenderComponent: React.VFC = () => {
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
    expect(queryByText('Something went wrong')).toBeFalsy()
    expect(queryByText('Try again?')).toBeFalsy()
  })

  it('renders fallback content when rendering child content failed', () => {
    const { queryByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(queryByText('Something went wrong')).toBeTruthy()
    expect(queryByText('Try again?')).toBeTruthy()
    expect(queryByText('Child Content')).toBeFalsy()
  })

  it('logs and tracks error with sentry', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(console.error).toHaveBeenCalledWith('[useErrorHandling.ts]', new Error('Test'), expect.any(String))
    expect(captureSentryException).toHaveBeenCalledWith(new Error('Test'))
  })

  it('resets error to retry rendering', () => {
    const { getByText, queryByText } = render(<ErrorOnFirstRenderComponent />)

    fireEvent.press(getByText('Try again?'))

    expect(queryByText('Child Content')).toBeTruthy()
    expect(queryByText('Something went wrong')).toBeFalsy()
    expect(queryByText('Try again?')).toBeFalsy()
  })
})
