import React, { type ErrorInfo } from 'react'

import { logError } from '@holi/core/errors/helpers'
import i18n from '@holi/core/i18n'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type ErrorBoundaryProps = {
  children?: React.ReactNode
  showErrorMsg?: boolean
  allowReload?: boolean
}

type ErrorBoundaryState = { error: Error | null }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static defaultProps = {
    showErrorMsg: false,
    allowReload: false,
  }

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
          {this.props.showErrorMsg && (
            <HoliText style={{ marginTop: 12 }} align="center">
              {this.state.error?.message}
            </HoliText>
          )}
          {this.props.allowReload && (
            <HoliButton
              label={t('error.errorBoundary.retry')}
              inline
              onPress={() => this.setState({ error: null })}
              style={{ marginTop: 24 }}
            >
              <HoliText>{t('error.errorBoundary.retry')}</HoliText>
            </HoliButton>
          )}
        </SafeArea>
      )
    }

    return <>{this.props.children}</>
  }
}

export default ErrorBoundary
