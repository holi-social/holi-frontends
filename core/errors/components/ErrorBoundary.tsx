import React, { ErrorInfo } from 'react'

import { logError } from '@holi/core/errors/helpers'
import i18n from '@holi/core/i18n'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'

type ErrorBoundaryProps = {
  children?: React.ReactNode
}

type ErrorBoundaryState = { error: Error | null }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, 'Failed to render component', {
      location: 'ErrorBoundary.componentDidCatch',
      ...errorInfo,
    })
    this.setState({ error })
  }

  render() {
    const { t } = i18n

    if (this.state.error) {
      return (
        <SafeArea style={{ padding: 12, alignItems: 'center' }}>
          <HoliText>{t('global.technicalError')}</HoliText>
        </SafeArea>
      )
    }

    return <>{this.props.children}</>
  }
}

export default ErrorBoundary
