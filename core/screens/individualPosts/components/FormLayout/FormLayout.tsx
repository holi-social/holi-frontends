import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'

import { useHeaderHeight } from '@react-navigation/elements'

import { PortalGate } from '@holi/core/providers/PortalProvider'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface FormLayoutProps {
  children: React.ReactNode
  bottomBar: React.ReactNode
  hasSuggestions?: boolean
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, bottomBar, hasSuggestions = true }) => {
  const { theme } = useTheme()

  const styles = useMemo(() => getStyles(theme), [theme])

  const headerHeight = useHeaderHeight()

  return (
    <SafeArea style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        <View>
          {hasSuggestions && <PortalGate gateName="suggestions" style={styles.suggestionsScrollView} />}
          {bottomBar}
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background10,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background20,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    scrollView: {
      flex: 1,
      flexGrow: 1,
    },
    suggestionsScrollView: {
      zIndex: 1,
      width: '100%',
      height: 140,
      maxHeight: 160,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: theme.colors.background10,
      borderColor: theme.dark ? theme.colors.brandColorB30 : theme.colors.background30,
      borderRadius: 12,
      elevation: 4,
      borderWidth: 1,
      left: 0,
      right: 0,
    },
  })

export default withProfiler(FormLayout, { name: 'FormLayout' })
