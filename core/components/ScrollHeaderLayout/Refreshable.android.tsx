import React from 'react'
import { RefreshControl, ScrollView } from 'react-native'

import Default from '@holi/core/components/ScrollHeaderLayout/Default'
import { RefreshableScrollHeaderLayoutProps } from '@holi/core/components/ScrollHeaderLayout/types'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { vars } from '@holi/ui/styles/globalVars'

const Refreshable = React.forwardRef<ScrollView, RefreshableScrollHeaderLayoutProps>(
  ({ refreshableProps: { isLoading, onRefresh }, headerOverlap, ...defaultLayoutProps }, ref) => {
    const { top } = useSafeAreaInsets()
    const additionalOffset = (headerOverlap ? top : 0) + +vars.topBarHeight

    return (
      <Default
        {...defaultLayoutProps}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} progressViewOffset={additionalOffset} />
        }
        headerOverlap={headerOverlap}
        ref={ref}
      />
    )
  }
)

Refreshable.displayName = 'ScrollHeaderLayout.Refreshable'

export default Refreshable
