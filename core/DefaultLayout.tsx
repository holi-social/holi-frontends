import React, { ReactChild, ReactChildren, ReactNode } from 'react'
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

/**
 * This is the default screen layout.
 * Scrolling works differently in mobile and web:
 * Mobile is done via `ScrollView` within this file.
 * Web scrolling is done here: `core/DefaultLayout.tsx`
 */

export type LayoutProps = {
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
  children: ReactChild | ReactChildren | ReactNode | Element
}

const DefaultLayout: React.FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const screenView = <View style={styles.screenLayout}>{props.children}</View>

  return Platform.OS === 'web' ? (
    screenView
  ) : (
    <ScrollView contentContainerStyle={[styles.scrollLayout, props.style]}>{screenView}</ScrollView>
  )
}

export default DefaultLayout

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    scrollLayout: {
      minHeight: '100%',
      width: '100%',
      justifyContent: 'flex-start',
      paddingBottom: 50,
    },
    screenLayout: {
      backgroundColor: theme.colors.backgroundColorWhite,
      minHeight: '100%',
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
  })
