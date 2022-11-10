import React from 'react'
import { Platform, ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

/**
 * This is the default screen layout.
 * Scrolling works differently in mobile and web:
 * Mobile is done via `ScrollView` within this file.
 * Web scrolling is done here: `core/DefaultLayout.tsx`
 */

export interface LayoutProps extends ScrollViewProps {
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
}

const DefaultLayout: React.FC<LayoutProps> = ({ style, children, ...scrollViewProps }: LayoutProps) => {
  const screenView = <View style={[styles.screenLayout, style]}>{children}</View>

  return Platform.OS === 'web' ? (
    screenView
  ) : (
    <ScrollView {...scrollViewProps} contentContainerStyle={[styles.scrollLayout, style]}>
      {screenView}
    </ScrollView>
  )
}

export default DefaultLayout

const styles = StyleSheet.create({
  scrollLayout: {
    justifyContent: 'flex-start',
    backgroundColor: colors.backgroundColorWhite,
  },
  screenLayout: {
    paddingBottom: 50,
  },
})
