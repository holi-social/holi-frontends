import React from 'react'
import { ScrollView } from 'react-native'

import { Props } from './types'

const HoliHorizontalScrollContainer = (props: Props) => {
  return <ScrollView {...props} horizontal role="tablist" accessibilityOrientation="horizontal" />
}

export default HoliHorizontalScrollContainer
