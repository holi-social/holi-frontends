import { withProfiler } from '@sentry/react'
import type React from 'react'
import { useMemo } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { PortalGate } from '@holi/core/providers/PortalProvider'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface FormLayoutProps {
  children: React.ReactNode
  bottomBar: React.ReactNode
  hasSuggestions?: boolean
  backgroundColor?: string
  scrollViewRef?: React.RefObject<ScrollView>
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, bottomBar, hasSuggestions = true, backgroundColor }) => {
  const { theme } = useTheme()

  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.wrapper]}>
      <View style={[styles.layout, backgroundColor ? { backgroundColor } : {}]}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          style={styles.container}
        >
          <HoliContainer>{children}</HoliContainer>
        </ScrollView>
      </View>
      <View style={styles.submitBarContainer}>
        <HoliContainer>
          {hasSuggestions && <PortalGate gateName="suggestions" style={styles.suggestionsScrollView} />}
        </HoliContainer>
        {bottomBar}
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.background10,
    },
    layout: {
      backgroundColor: theme.colors.background20,
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      paddingBottom: 120,
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
      position: 'fixed',
      bottom: 0,
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
