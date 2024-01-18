import type { PropsWithChildren } from 'react'
import React from 'react'
import { View } from 'react-native'

import variables from '@holi/ui/styles/globalVars/variables'

type HoliGapSize = 'xs' | 's' | 'm' | 'l' | 'xl'
type HoliGapDirection = 'vertical' | 'horizontal'

interface HoliGapProps {
  size?: HoliGapSize
  direction?: HoliGapDirection
  testID?: string
}

const sizes = {
  xs: +variables.spacingXs,
  s: +variables.spacingS,
  m: +variables.spacingM,
  l: +variables.spacingL,
  xl: +variables.spacingXl,
}

export const HoliGap = ({ size = 'm', direction = 'vertical', testID }: PropsWithChildren<HoliGapProps>) => {
  const styleProp = direction === 'vertical' ? 'height' : 'width'

  return <View style={{ [styleProp]: sizes[size] }} testID={testID} />
}
