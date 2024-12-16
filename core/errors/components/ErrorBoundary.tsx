import React, { type ErrorInfo } from 'react'

import { logError } from '@holi/core/errors/helpers'
import i18n from '@holi/core/i18n'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { Button } from 'holi-bricks/components/button'
import { View, StyleSheet } from 'react-native'

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
    const styles = getStyles()

    if (this.state.error) {
      return (
        <SafeArea style={styles.container}>
          <HoliText>{t('global.technicalError')}</HoliText>
          {this.props.showErrorMsg && (
            <HoliText style={styles.text} align="center">
              {this.state.error?.message}
            </HoliText>
          )}
          {this.props.allowReload && (
            <View style={styles.button}>
              <Button
                label="{t('error.errorBoundary.retry')}"
                inline
                onPress={() => this.setState({ error: null })}
                testID="error.errorBoundary.retry"
              />
            </View>
          )}
        </SafeArea>
      )
    }

    return <>{this.props.children}</>
  }
}

const getStyles = () =>
  StyleSheet.create({
    button: {
      marginTop: 24,
    },
    container: {
      padding: 12,
      alignItems: 'center',
    },
    text: {
      marginTop: 12,
    },
  })

export default ErrorBoundary
