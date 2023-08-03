import React, { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, View } from 'react-native'

import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import { useMobileScrollHandler } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { throttleDebounce } from '@holi/ui/helper/throttleDebounce'
import { colors, vars } from '@holi/ui/styles/globalVars'

const SCROLL_EVENT_THROTTLE_MS = 250

const nativeEventPersist = (event: NativeSyntheticEvent<NativeScrollEvent>) => event.persist()

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

    const contentView = (
      <View
        style={[hasFooterTabBar && styles.footerPadding, contentStyle]}
        ref={isWeb ? (ref as React.LegacyRef<View>) : undefined}
        testID={testID}
      >
        {children}
      </View>
    )

    // capture mobile events via onScroll, web is done differently (to not use scroll listeners -> bad!)
    const onScrollHandler = useMobileScrollHandler(onScroll)
    // throttle mobile scroll events, because android doesn't have `scrollEventThrottle`
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onScrollThrottled = useCallback(
      throttleDebounce(onScrollHandler, SCROLL_EVENT_THROTTLE_MS, nativeEventPersist),
      [onScrollHandler]
    )

    return scrollable ? (
      <ScrollView
        testID={testID}
        // on web `onScroll` would not trigger in this global scroll view anyway
        // (only when setting it to a specific height, but we don't want that,
        //  because we explicitly want this scroll view to be the default one)
        // if you need scroll events in web, use our `useScrollY` hook or
        // add a callback to the window listener above
        onScroll={isWeb ? undefined : onScrollThrottled}
        // our throttling does better when we don't compete with ios throttling
        // halving the rate gives us a healthy amount of updates to decide upon
        scrollEventThrottle={SCROLL_EVENT_THROTTLE_MS / 2}
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
