import type { PropsWithChildren } from 'react'
import React from 'react'
import { View } from 'react-native'

import { dimensions } from '@holi/ui/styles/globalVars'

type HoliGapSize = 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'ml' | 'l' | 'xl'
type HoliGapDirection = 'vertical' | 'horizontal'

interface HoliGapProps {
  size?: HoliGapSize
  direction?: HoliGapDirection
  testID?: string
}

const sizes = {
  xxs: dimensions.spacingXxs,
  xs: dimensions.spacingXs,
  s: dimensions.spacingS,
  sm: dimensions.spacingSM,
  m: dimensions.spacingM,
  ml: dimensions.spacingML,
  l: dimensions.spacingL,
  xl: dimensions.spacingXl,
}

export const HoliGap = ({ size = 'm', direction = 'vertical', testID }: PropsWithChildren<HoliGapProps>) => {
  const styleProp = direction === 'vertical' ? 'height' : 'width'

  return <View style={{ [styleProp]: sizes[size] }} testID={testID} />
}
