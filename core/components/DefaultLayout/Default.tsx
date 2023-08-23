import React from 'react'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { colors, vars } from '@holi/ui/styles/globalVars'

const Default = React.forwardRef<ScrollView, LayoutProps>(
  (
    {
      hasFooterTabBar = true,
      scrollable = true,
      style,
      contentStyle,
      children,
      backgroundColor = colors.background10,
      testID,
      onScroll,
      ...scrollViewProps
    },
    ref
  ) => {
    const isWeb = Platform.OS === 'web'
    const throttledScrollEventProps = useThrottledMobileScrollEvents({ onScroll })

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
        {...throttledScrollEventProps}
        {...scrollViewProps}
        contentContainerStyle={[styles.scrollLayout, { backgroundColor }, style]}
        ref={!isWeb ? (ref as React.LegacyRef<ScrollView>) : undefined}
      >
        {contentView}
      </ScrollView>
    ) : (
      <View testID={testID} style={[styles.scrollLayout, { backgroundColor }, style]}>
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
  },
})
