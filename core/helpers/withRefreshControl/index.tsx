import React from 'react'
import { RefreshControl, ScrollView, ScrollViewProps } from 'react-native'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import {
  RefreshableScrollHeaderLayoutProps,
  RefreshableScrollViewProps,
} from '@holi/core/components/ScrollHeaderLayout/types'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { dimensions } from '@holi/ui/styles/globalVars'

export function withRefreshControl<P extends LayoutProps, T>(
  ScrollComponent: (props: RefreshableScrollViewProps<P>, ref: React.ForwardedRef<T>) => React.ReactNode
) {
  const WithRefreshControl = React.forwardRef(
    (
      {
        refreshableProps: { refreshing, onRefresh },
        headerOverlap,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        webWrapperStyle,
        ...scrollViewProps
      }: RefreshableScrollHeaderLayoutProps<P>,
      ref: React.ForwardedRef<T>
    ) => {
      const { top: safeAreaTop } = useSafeAreaInsets()
      const additionalOffset = headerOverlap ? safeAreaTop + dimensions.topBarHeight : 0

      const refreshControl = (
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={additionalOffset} />
      )
      return (
        <ScrollComponent {...scrollViewProps} refreshControl={refreshControl} headerOverlap={headerOverlap} ref={ref} />
      )
    }
  )

  WithRefreshControl.displayName = 'WithRefreshControl'

  return WithRefreshControl
}

export const ScrollViewRefreshable = withRefreshControl<ScrollViewProps, ScrollView>((props) => (
  <ScrollView {...props} />
))
