import React from 'react'
import { RefreshControl, ScrollView, type ScrollViewProps } from 'react-native'

import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import type {
  RefreshableScrollHeaderLayoutProps,
  RefreshableScrollViewProps,
} from '@holi/core/components/ScrollHeaderLayout/types'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'
import { dimensions } from '@holi/ui/styles/globalVars'

export function withRefreshControl<P extends LayoutProps, T>(
  ScrollComponent: (props: RefreshableScrollViewProps<P>) => React.ReactNode
) {
  const WithRefreshControl = React.forwardRef(
    (
      {
        headerOverlap,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        webWrapperStyle,
        ...scrollViewProps
      }: RefreshableScrollHeaderLayoutProps<P>,
      ref: React.ForwardedRef<T>
    ) => {
      const { top: safeAreaTop } = useSafeAreaInsets()
      const additionalOffset = headerOverlap ? safeAreaTop + dimensions.topBarHeight : 0
      const { refreshControlProps } = useRefreshContext()

      const refreshControl = (
        <RefreshControl
          {...refreshControlProps}
          progressViewOffset={additionalOffset}
          testID={refreshControlProps.refreshing ? 'refreshing' : 'not-refreshing'}
        />
      )
      return (
        <ScrollComponent {...scrollViewProps} refreshControl={refreshControl} headerOverlap={headerOverlap} ref={ref} />
      )
    }
  )

  WithRefreshControl.displayName = 'WithRefreshControl'

  return WithRefreshControl
}

const ScrollViewWithRef = React.forwardRef<ScrollView, ScrollViewProps>((props, ref) => (
  <ScrollView {...props} ref={ref} />
))
ScrollViewWithRef.displayName = 'ScrollViewWithRef'

export const ScrollViewRefreshable = withRefreshControl(ScrollViewWithRef)
