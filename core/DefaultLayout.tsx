import React, { ReactChild, ReactChildren, ReactNode } from 'react'
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

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
  const screenView = <View style={[styles.screenLayout, props.style]}>{props.children}</View>

  return Platform.OS === 'web' ? (
    screenView
  ) : (
    <ScrollView contentContainerStyle={styles.scrollLayout}>{screenView}</ScrollView>
  )
}

export default DefaultLayout

const styles = StyleSheet.create({
  scrollLayout: {
    minHeight: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 50,
    backgroundColor: colors.backgroundColorWhite,
  },
  screenLayout: {
    minHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
})
