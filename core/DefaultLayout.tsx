import React, { ReactChild, ReactChildren, ReactNode } from 'react'
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native'

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
    <View style={styles.screenLayout}>{props.children}</View>
  ) : (
    <ScrollView contentContainerStyle={[styles.scrollLayout, props.style]}>
      <View style={styles.screenLayout}>{props.children}</View>
    </ScrollView>
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
