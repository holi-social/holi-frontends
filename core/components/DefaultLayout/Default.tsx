import React from 'react'
import { Platform, ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

const Default = React.forwardRef<ScrollView, LayoutProps>(
  (
    {
      hasFooterTabBar = true,
      scrollable = true,
      style,
      contentStyle,
      children,
      backgroundColor,
      testID,
      onScroll,
      ...scrollViewProps
    },
    ref
  ) => {
    const { theme } = useTheme()
    const { colors } = theme
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
        contentContainerStyle={[
          styles.scrollLayout,
          { backgroundColor: backgroundColor || colors.background10 },
          style,
        ]}
        ref={!isWeb ? (ref as React.LegacyRef<ScrollView>) : undefined}
      >
        {contentView}
      </ScrollView>
    ) : (
      <View
        testID={testID}
        style={[styles.scrollLayout, { backgroundColor: backgroundColor || colors.background10 }, style]}
      >
        {contentView}
      </View>
    )
  }
)

Default.displayName = 'DefaultLayout.Default'

export default Default

const styles = StyleSheet.create({
  footerPadding: {
    paddingBottom: Platform.OS === 'web' ? dimensions.bottomBarHeight : 24,
  },
  scrollLayout: {
    justifyContent: 'flex-start',
  },
})
