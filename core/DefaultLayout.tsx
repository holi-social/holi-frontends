import React from 'react'
import { Platform, ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native'

import { colors, vars } from '@holi/ui/styles/globalVars'

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
    minHeight: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 50,
    backgroundColor: colors.backgroundColorWhite,
    paddingBottom: 50,
  },
  screenLayout: {
    minHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    ...Platform.select({ web: { paddingBottom: +vars.bottomBarHeight + 50 } }),
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
})
