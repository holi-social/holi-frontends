import React from 'react'
import { ScrollView } from 'react-native'

import DefaultLayout, { LayoutProps } from '@holi/core/components/DefaultLayout'
import { useScrollHandlerHandler } from '@holi/core/components/ScrollHeaderLayout/useScrollHandlerHandler'

const Default = React.forwardRef<ScrollView, LayoutProps>(
  ({ onScroll, children, ...scrollViewProps }: LayoutProps, ref) => {
    const onScrollHandler = useScrollHandlerHandler(onScroll)

    return (
      <DefaultLayout {...scrollViewProps} onScroll={onScrollHandler} scrollEventThrottle={200} ref={ref}>
        {children}
      </DefaultLayout>
    )
  }
)

Default.displayName = 'ScrollHeaderLayout'

export default Default
