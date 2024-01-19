import type { PropsWithChildren } from 'react'
import React from 'react'
import { View } from 'react-native'

import { vars } from '@holi/ui/styles/globalVars'

type HoliGapSize = 'xs' | 's' | 'm' | 'l' | 'xl'
type HoliGapDirection = 'vertical' | 'horizontal'

interface HoliGapProps {
  size?: HoliGapSize
  direction?: HoliGapDirection
  testID?: string
}

const sizes = {
  xs: vars.spacingXs,
  s: vars.spacingS,
  m: vars.spacingM,
  l: vars.spacingL,
  xl: vars.spacingXl,
}

export const HoliGap = ({ size = 'm', direction = 'vertical', testID }: PropsWithChildren<HoliGapProps>) => {
  const styleProp = direction === 'vertical' ? 'height' : 'width'

  return <View style={{ [styleProp]: sizes[size] }} testID={testID} />
}
