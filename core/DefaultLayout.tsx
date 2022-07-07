import React, { ReactChild, ReactChildren, ReactNode } from 'react'
import { Platform, ScrollView, StyleSheet, ViewStyle } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

/**
 * This is the default mobile layout. It ensures scrolling.
 * The web layout is defined here: `core/DefaultLayout.tsx`
 */

export type LayoutProps = {
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
  children: ReactChild | ReactChildren | ReactNode | Element
}

const DefaultLayout: React.FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  return Platform.OS === 'web' ? (
    <>{props.children}</>
  ) : (
    <ScrollView contentContainerStyle={[styles.layout, props.style]}>{props.children}</ScrollView>
  )
}

export default DefaultLayout

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layout: {
      minHeight: '100%',
      width: '100%',
      justifyContent: 'flex-start',
      backgroundColor: theme.colors.backgroundColorWhite,
      paddingBottom: 50,
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
  })
