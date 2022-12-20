import React from 'react'
import { Platform, SafeAreaView, ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native'

import { colors, vars } from '@holi/ui/styles/globalVars'

/**
 * This is the default screen layout.
 * Scrolling works differently in mobile and web:
 * Mobile is done via `ScrollView` within this file.
 * Web scrolling is done here: `core/DefaultLayout.tsx`
 */

export interface LayoutProps extends ScrollViewProps {
  headerOverlap?: boolean
  hasFooterTabBar?: boolean
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
  testID?: string
}

const DefaultLayout = React.forwardRef<ScrollView, LayoutProps>(
  ({ style, children, headerOverlap, hasFooterTabBar = true, ...scrollViewProps }: LayoutProps, ref) => {
    const isWeb = Platform.OS === 'web'

    const screenView = (
      <View
        style={[
          !headerOverlap && scrollViewProps.onScroll && styles.headerPadding,
          hasFooterTabBar && styles.footerPadding,
          style,
        ]}
        ref={isWeb ? (ref as React.LegacyRef<View>) : undefined}
      >
        {children}
      </View>
    )

    if (Platform.OS === 'web') return screenView

    const mobileLayout = (
      <ScrollView
        {...scrollViewProps}
        contentContainerStyle={[styles.scrollLayout, style]}
        ref={!isWeb ? (ref as React.LegacyRef<ScrollView>) : undefined}
      >
        {screenView}
      </ScrollView>
    )

    return headerOverlap ? mobileLayout : <SafeAreaView style={styles.safeArea}>{mobileLayout}</SafeAreaView>
  }
)

DefaultLayout.displayName = 'DefaultLayout'

export default DefaultLayout

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerPadding: {
    paddingTop: +vars.topBarHeight + (Platform.OS === 'android' ? 32 : 0),
  },
  footerPadding: {
    paddingBottom: (Platform.OS === 'web' ? +vars.bottomBarHeight : 0) + 50,
  },
  scrollLayout: {
    justifyContent: 'flex-start',
    backgroundColor: colors.backgroundColorWhite,
  },
})
