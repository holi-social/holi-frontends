import React from 'react'
import { Platform, ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native'

import { colors, vars } from '@holi/ui/styles/globalVars'

export interface LayoutProps extends ScrollViewProps {
  headerOverlap?: boolean
  hasFooterTabBar?: boolean
  scrollable?: boolean
  style?: ViewStyle
  contentStyle?: ViewStyle
  testID?: string
}

const Default = React.forwardRef<ScrollView, LayoutProps>(
  ({ hasFooterTabBar = true, scrollable = true, style, contentStyle, children, testID, ...scrollViewProps }, ref) => {
    const isWeb = Platform.OS === 'web'

    const contentView = (
      <View
        style={[hasFooterTabBar && styles.footerPadding, contentStyle]}
        ref={isWeb ? (ref as React.LegacyRef<View>) : undefined}
        testID={testID}
      >
        {children}
      </View>
    )

    return scrollable ? (
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
  }
)

Default.displayName = 'DefaultLayout.Default'

export default Default

const styles = StyleSheet.create({
  footerPadding: {
    paddingBottom: Platform.OS === 'web' ? +vars.bottomBarHeight : 24,
  },
  scrollLayout: {
    justifyContent: 'flex-start',
    backgroundColor: colors.background10,
  },
})
