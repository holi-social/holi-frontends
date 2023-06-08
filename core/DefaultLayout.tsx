import React from 'react'
import { Platform, ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native'

import SafeArea from '@holi/ui/components/atoms/SafeArea'
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
  scrollable?: boolean
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
  contentStyle?: ViewStyle | ViewStyle[] | Record<string, unknown>
  testID?: string
}

const DefaultLayout = React.forwardRef<ScrollView, LayoutProps>(
  (
    {
      headerOverlap,
      hasFooterTabBar = true,
      scrollable = true,
      style,
      contentStyle,
      children,
      testID,
      ...scrollViewProps
    },
    ref
  ) => {
    const isWeb = Platform.OS === 'web'

    const contentView = (
      <View
        style={[
          !headerOverlap && scrollViewProps.onScroll && styles.headerPadding,
          hasFooterTabBar && styles.footerPadding,
          contentStyle,
        ]}
        ref={isWeb ? (ref as React.LegacyRef<View>) : undefined}
        testID={testID}
      >
        {children}
      </View>
    )

    const mobileWrapper = scrollable ? (
      <ScrollView
        testID={testID}
        {...scrollViewProps}
        contentContainerStyle={[styles.scrollLayout, style]}
        ref={!isWeb ? (ref as React.LegacyRef<ScrollView>) : undefined}
      >
        {contentView}
      </ScrollView>
    ) : (
      <View testID={testID} style={[styles.scrollLayout, style]}>
        {contentView}
      </View>
    )

    return headerOverlap ? mobileWrapper : <SafeArea style={styles.safeArea}>{mobileWrapper}</SafeArea>
  }
)

DefaultLayout.displayName = 'DefaultLayout'

export default DefaultLayout

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background10,
  },
  headerPadding: {
    paddingTop: vars.topBarHeight + (Platform.OS === 'ios' ? -8 : 0),
  },
  footerPadding: {
    paddingBottom: Platform.OS === 'web' ? +vars.bottomBarHeight : 24,
  },
  scrollLayout: {
    justifyContent: 'flex-start',
    backgroundColor: colors.background10,
  },
})
