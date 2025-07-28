import type { PropsWithChildren } from 'react'
import React from 'react'
import { View } from 'react-native'

import { Spacing } from 'holi-bricks/foundations'

type HoliGapSize = 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'ml' | 'l' | 'xl'
type HoliGapDirection = 'vertical' | 'horizontal'

interface HoliGapProps {
  size?: HoliGapSize
  direction?: HoliGapDirection
  testID?: string
}

const sizes = {
  xxs: Spacing['4xs'],
  xs: Spacing['3xs'],
  s: Spacing.xs,
  sm: Spacing.xxs,
  m: Spacing.md,
  ml: Spacing.lg,
  l: Spacing.xl,
  xl: Spacing['4xl'],
}

export const HoliGap = ({ size = 'm', direction = 'vertical', testID }: PropsWithChildren<HoliGapProps>) => {
  const styleProp = direction === 'vertical' ? 'height' : 'width'

  return <View style={{ [styleProp]: sizes[size] }} testID={testID} />
}
