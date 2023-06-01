import React from 'react'
import { RefreshControl, ScrollView } from 'react-native'

import Default from '@holi/core/components/ScrollHeaderLayout/Default'
import { RefreshableScrollHeaderLayoutProps } from '@holi/core/components/ScrollHeaderLayout/types'
import { useScrollHandler } from '@holi/core/components/ScrollHeaderLayout/useScrollHandler'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { vars } from '@holi/ui/styles/globalVars'

const Refreshable = React.forwardRef<ScrollView, RefreshableScrollHeaderLayoutProps>(
  ({ refreshableProps: { isLoading, onRefresh }, headerOverlap, onScroll, ...defaultLayoutProps }, ref) => {
    const { top } = useSafeAreaInsets()
    const additionalOffset = (headerOverlap ? top : 0) + +vars.topBarHeight

    const onScrollHandler = useScrollHandler(onScroll)

    return (
      <Default
        {...defaultLayoutProps}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} progressViewOffset={additionalOffset} />
        }
        onScroll={onScrollHandler}
        headerOverlap={headerOverlap}
        ref={ref}
      />
    )
  }
)

Refreshable.displayName = 'ScrollHeaderLayout.Refreshable'

export default Refreshable
