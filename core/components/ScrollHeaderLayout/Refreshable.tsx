import React from 'react'
import { Platform, RefreshControl, ScrollView, View } from 'react-native'

import Default from '@holi/core/components/ScrollHeaderLayout/Default'
import { RefreshableScrollHeaderLayoutProps } from '@holi/core/components/ScrollHeaderLayout/types'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { vars } from '@holi/ui/styles/globalVars'

const Refreshable = React.forwardRef<ScrollView, RefreshableScrollHeaderLayoutProps>(
  (
    {
      refreshableProps: { refreshing, onRefresh },
      headerOverlap,
      ScrollViewComponent = Default,
      ...defaultLayoutProps
    },
    ref
  ) => {
    const { top } = useSafeAreaInsets()
    const additionalOffset = (headerOverlap ? top : 0) + +vars.topBarHeight

    return (
      <ScrollViewComponent
        {...defaultLayoutProps}
        refreshControl={
          Platform.OS === 'ios' ? (
            <View style={{ top: additionalOffset, zIndex: 10 }}>
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            </View>
          ) : (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={additionalOffset} />
          )
        }
        headerOverlap={headerOverlap}
        ref={ref}
      />
    )
  }
)

Refreshable.displayName = 'ScrollHeaderLayout.Refreshable'

export default Refreshable
