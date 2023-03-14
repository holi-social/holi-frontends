import React, { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'

import DefaultLayout, { LayoutProps } from '@holi/core/DefaultLayout'
import { onScreenScrollY } from '@holi/core/helpers'
import { useCallWhenCurrentScreenIsActive } from '@holi/core/helpers/useCallWhenCurrentScreenIsActive'

const DefaultScrollHeaderLayout = React.forwardRef<ScrollView, LayoutProps>(
  ({ onScroll, children, ...scrollViewProps }: LayoutProps, ref) => {
    const onScreenScrollHeader = useCallWhenCurrentScreenIsActive(onScreenScrollY)

    const onScrollHandler = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        onScroll?.(event)
        onScreenScrollHeader(event)
      },
      [onScreenScrollHeader, onScroll]
    )

    return (
      <DefaultLayout {...scrollViewProps} onScroll={onScrollHandler} scrollEventThrottle={200} ref={ref}>
        {children}
      </DefaultLayout>
    )
  }
)

DefaultScrollHeaderLayout.displayName = 'DefaultScrollHeaderLayout'

export default DefaultScrollHeaderLayout
