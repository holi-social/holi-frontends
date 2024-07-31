import React, { PropsWithChildren, forwardRef, useCallback } from 'react'
import { type NativeScrollEvent, type NativeSyntheticEvent, RefreshControl } from 'react-native'
import Animated from 'react-native-reanimated'

import { setScreenScrollY } from '@holi/core/helpers'

import { ScrollHeaderLayoutProps } from './types'
import { useHeaderOffsetOptions } from './useHeaderOffsetOptions'
import { useSyncWithHeader } from './useSyncWithHeader'

const ScrollHeaderLayout = forwardRef<Animated.ScrollView | null, PropsWithChildren<ScrollHeaderLayoutProps>>(
  (
    {
      headerRelation = 'offset',
      refreshControlProps,
      backgroundColor,
      children,
      style,
      contentContainerStyle,
      testID,
      onScroll,
      ...scrollViewProps
    },
    ref
  ) => {
    const scrollViewRef = useSyncWithHeader()

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
      <Animated.ScrollView
        {...scrollViewProps}
        ref={scrollViewRef}
        onLayout={() => {
          if (!!ref && 'current' in ref) ref.current = scrollViewRef.current
        }}
        refreshControl={
          refreshControlProps ? (
            <RefreshControl {...refreshControlProps} progressViewOffset={refreshControlOffset} />
          ) : undefined
        }
        style={[!!backgroundColor && { backgroundColor }, style]}
        contentContainerStyle={[{ paddingTop: offset }, contentContainerStyle]}
        onScroll={onScrollHandler}
        testID={testID}
      >
        <Animated.View style={refreshControlStyle}>{children}</Animated.View>
      </Animated.ScrollView>
    )
  }
)

ScrollHeaderLayout.displayName = 'ScrollHeaderLayout'

export default ScrollHeaderLayout
