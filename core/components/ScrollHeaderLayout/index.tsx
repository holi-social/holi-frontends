import React, { type PropsWithChildren, forwardRef, useCallback } from 'react'
import { type NativeScrollEvent, type NativeSyntheticEvent, RefreshControl } from 'react-native'
import Animated from 'react-native-reanimated'

import { setScreenScrollY } from '@holi/core/helpers'
import { useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import type { ScrollHeaderLayoutProps } from './types'
import { useHeaderOffsetOptions } from './useHeaderOffsetOptions'
import { useSyncWithHeader } from './useSyncWithHeader'

const AwareAnimatedScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView)
const ScrollHeaderLayout = forwardRef<Animated.ScrollView | null, PropsWithChildren<ScrollHeaderLayoutProps>>(
  (
    {
      headerRelation = 'offset',
      backgroundColor,
      children,
      style,
      contentContainerStyle,
      testID,
      onScroll,
      onLayout,
      noRefresh,
      refreshBackgroundColor,
      ...scrollViewProps
    },
    ref
  ) => {
    const scrollViewRef = useSyncWithHeader()
    const { refreshControlProps } = useRefreshContext()

    const { offset, refreshControlOffset, refreshControlStyle } = useHeaderOffsetOptions(
      headerRelation,
      refreshControlProps?.refreshing
    )

    const onScrollHandler = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // Syncing global scrollY value with current screen scrollY value
        setScreenScrollY(event.nativeEvent.contentOffset.y)
        onScroll?.(event)
      },
      [onScroll]
    )

    return (
      <AwareAnimatedScrollView
        {...scrollViewProps}
        ref={scrollViewRef}
        onLayout={(event) => {
          if (!!ref && 'current' in ref) ref.current = scrollViewRef.current
          if (onLayout) onLayout(event)
        }}
        refreshControl={
          refreshControlProps && !noRefresh ? (
            <RefreshControl
              style={refreshBackgroundColor ? { backgroundColor: refreshBackgroundColor } : undefined}
              {...refreshControlProps}
              progressViewOffset={refreshControlOffset}
            />
          ) : undefined
        }
        style={[!!backgroundColor && { backgroundColor }, style]}
        contentContainerStyle={[{ paddingTop: offset }, contentContainerStyle]}
        onScroll={onScrollHandler}
        testID={testID}
      >
        <Animated.View style={refreshControlStyle}>{children}</Animated.View>
      </AwareAnimatedScrollView>
    )
  }
)

ScrollHeaderLayout.displayName = 'ScrollHeaderLayout'

export default ScrollHeaderLayout
