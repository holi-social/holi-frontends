import React from 'react'
import { RefreshControl } from 'react-native'

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
      const { top } = useSafeAreaInsets()
      const additionalOffset = (headerOverlap ? top : 0) + dimensions.topBarHeight

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
