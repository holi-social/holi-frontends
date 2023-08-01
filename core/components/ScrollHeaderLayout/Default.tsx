import React from 'react'
import { ScrollView } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'

const Default = React.forwardRef<ScrollView, LayoutProps>(({ children, ...scrollViewProps }, ref) => {
  return (
    <DefaultLayout {...scrollViewProps} ref={ref}>
      {children}
    </DefaultLayout>
  )
})

Default.displayName = 'ScrollHeaderLayout'

export default Default
