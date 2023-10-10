import React from 'react'
import { ScrollView } from 'react-native'

import { Props } from './types'

const HoliHorizontalScrollContainer = React.forwardRef<ScrollView, Props>((props, ref) => {
  return <ScrollView {...props} horizontal role="tablist" accessibilityOrientation="horizontal" ref={ref} />
})
HoliHorizontalScrollContainer.displayName = 'HoliHorizontalScrollContainer'

export default HoliHorizontalScrollContainer
