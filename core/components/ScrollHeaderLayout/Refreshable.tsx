import React from 'react'
import { Platform, RefreshControl, ScrollView, View } from 'react-native'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import Default from '@holi/core/components/ScrollHeaderLayout/Default'
import { RefreshableScrollHeaderLayoutProps } from '@holi/core/components/ScrollHeaderLayout/types'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { vars } from '@holi/ui/styles/globalVars'

function RefreshableComponent<T extends LayoutProps>(
  {
    refreshableProps: { refreshing, onRefresh },
    headerOverlap,
    ScrollViewComponent = Default,
    ...scrollViewProps
  }: RefreshableScrollHeaderLayoutProps<T>,
  ref: React.ForwardedRef<ScrollView>
) {
  const { top } = useSafeAreaInsets()
  const additionalOffset = (headerOverlap ? top : 0) + +vars.topBarHeight

  const refreshControl =
    Platform.OS === 'ios' ? (
      <View style={{ top: additionalOffset, zIndex: 10 }}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      </View>
    ) : (
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={additionalOffset} />
    )

  return (
    <ScrollViewComponent {...scrollViewProps} refreshControl={refreshControl} headerOverlap={headerOverlap} ref={ref} />
  )
}

const Refreshable = React.forwardRef(RefreshableComponent)

Refreshable.displayName = 'ScrollHeaderLayout.Refreshable'

export default Refreshable
