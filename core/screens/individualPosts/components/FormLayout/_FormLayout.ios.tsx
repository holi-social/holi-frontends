import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'

import { useHeaderHeight } from '@react-navigation/elements'

import { PortalGate } from '@holi/core/providers/PortalProvider'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : dimensions.bottomBarHeight - Spacing.xs}
    >
      <View style={styles.layout}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          style={styles.container}
        >
          {children}
        </ScrollView>

        <View style={styles.submitBarContainer}>
          {hasSuggestions && <PortalGate gateName="suggestions" style={styles.suggestionsScrollView} />}
          {bottomBar}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.background10,
    },
    layout: {
      backgroundColor: theme.colors.background20,
      width: '100%',
      height: '100%',
      flexDirection: 'column',
    },
    container: {
      flex: 1,
      width: '100%',
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: Spacing.md,
    },
    submitBarContainer: {
      width: '100%',
      backgroundColor: theme.colors.background20,
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
