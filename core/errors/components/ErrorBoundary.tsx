import React from 'react'

import { logError } from '@holi/core/errors/useErrorHandling'
import i18n from '@holi/core/i18n'
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
    logError(error, '[ErrorBoundary.tsx]', errorInfo.componentStack)
    this.setState({ error })
  }

  render() {
    const { t } = i18n

    if (this.state.error) {
      return (
        <SafeArea style={{ padding: 10, alignItems: 'center' }}>
          <HoliText>{t('error.errorBoundary.heading')}</HoliText>
          <HoliButton label={t('error.errorBoundary.retry')} inline onPress={() => this.setState({ error: null })}>
            <HoliText>{t('error.errorBoundary.retry')}</HoliText>
          </HoliButton>
        </SafeArea>
      )
    }

    return <>{this.props.children}</>
  }
}

export default ErrorBoundary
