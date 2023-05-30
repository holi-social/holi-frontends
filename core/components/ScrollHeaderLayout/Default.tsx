import React from 'react'
import { ScrollView } from 'react-native'

import DefaultLayout, { LayoutProps } from '@holi/core/components/DefaultLayout'
import { useScrollHandler } from '@holi/core/components/ScrollHeaderLayout/useScrollHandler'

const Default = React.forwardRef<ScrollView, LayoutProps>(
  ({ onScroll, children, ...scrollViewProps }: LayoutProps, ref) => {
    const onScrollHandler = useScrollHandler(onScroll)

    return (
      <DefaultLayout {...scrollViewProps} onScroll={onScrollHandler} scrollEventThrottle={200} ref={ref}>
        {children}
      </DefaultLayout>
    )
  }
)

Default.displayName = 'ScrollHeaderLayout'

export default Default
