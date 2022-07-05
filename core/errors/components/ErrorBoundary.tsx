import React from 'react'

import useErrorHandling from '@holi/core/errors/useErrorHandling'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import SafeArea from '@holi/ui/components/SafeArea'

type ErrorBoundaryProps = {
  children: React.ReactChild | React.ReactChildren | (React.ReactChild | string | undefined)[]
}

type ErrorBoundaryState = { error: Error | null }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    const { logError } = useErrorHandling() // eslint-disable-line
    logError(error, '[ErrorBoundary.tsx]', errorInfo.componentStack)
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      return (
        <SafeArea style={{ padding: 10, alignItems: 'center' }}>
          <HoliText>Something went wrong</HoliText>
          <HoliButton label="Try again?" inline onPress={() => this.setState({ error: null })}>
            <HoliText>Try again?</HoliText>
          </HoliButton>
        </SafeArea>
      )
    }

    return <>{this.props.children}</>
  }
}

export default ErrorBoundary
