import React from 'react'
import { ScrollView } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import { useScrollHandler } from '@holi/core/components/ScrollHeaderLayout/useScrollHandler'

const Default = React.forwardRef<ScrollView, LayoutProps>(({ onScroll, children, ...scrollViewProps }, ref) => {
  const onScrollHandler = useScrollHandler(onScroll)

  return (
    <DefaultLayout {...scrollViewProps} onScroll={onScrollHandler} scrollEventThrottle={200} ref={ref}>
      {children}
    </DefaultLayout>
  )
})

Default.displayName = 'ScrollHeaderLayout'

export default Default
