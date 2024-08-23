import React, { PropsWithChildren, forwardRef } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'

import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import { useRefreshControl } from '@holi/core/refreshing/hooks/useRefreshControl'

import { ScrollHeaderLayoutProps } from './types'
import { useHeaderOffsetOptions } from './useHeaderOffsetOptions'
import { useSyncWithHeader } from './useSyncWithHeader'

const ScrollHeaderLayout = forwardRef<Animated.ScrollView | null, PropsWithChildren<ScrollHeaderLayoutProps>>(
  (
    {
      headerRelation = 'offset',
      backgroundColor,
      children,
      style,
      contentContainerStyle,
      testID,
      noRefresh,
      ...scrollViewProps
    },
    ref
  ) => {
    useSyncWithHeader()
    const { offset } = useHeaderOffsetOptions(headerRelation)
    const { refreshControlProps } = useRefreshControl()

    return (
      <div style={{ paddingTop: offset, flex: 1 }}>
        {refreshControlProps && !noRefresh ? (
          <ScrollViewRefreshable
            {...scrollViewProps}
            ref={ref}
            style={[styles.scrollView, !!backgroundColor && { backgroundColor }, style]}
            contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
            webWrapperStyle={{ minHeight: '100%' }}
            testID={testID}
          >
            {children}
          </ScrollViewRefreshable>
        ) : (
          <ScrollView
            {...scrollViewProps}
            ref={ref}
            style={[styles.scrollView, !!backgroundColor && { backgroundColor }, style]}
            contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
            testID={testID}
          >
            {children}
          </ScrollView>
        )}
      </div>
    )
  }
)

ScrollHeaderLayout.displayName = 'ScrollHeaderLayout'

export default ScrollHeaderLayout

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
  },
  contentContainer: {
    flex: 1,
  },
})
