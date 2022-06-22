import React from 'react'
import { Text } from 'react-native'

import useErrorHandling from '@holi/core/errors/useErrorHandling'
import HoliButton from '@holi/ui/components/HoliButton'
import { SafeAreaView } from '@holi/ui/components/safe-area'

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
    const { logError } = useErrorHandling()
    logError(error, '[ErrorBoundary.tsx]', errorInfo.componentStack)
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView style={{ padding: 10, alignItems: 'center' }}>
          <Text>Something went wrong</Text>
          <HoliButton label="Try again?" inline onPress={() => this.setState({ error: null })}>
            Try again?
          </HoliButton>
        </SafeAreaView>
      )
    }

    return <>{this.props.children}</>
  }
}

export default ErrorBoundary
