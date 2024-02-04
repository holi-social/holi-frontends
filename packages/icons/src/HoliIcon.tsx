import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'

export type HoliIconProps = {
  icon: HoliIconType
  filled?: boolean
  size?: number
  color?: string
  loading?: boolean
  testID?: string
  style?: StyleProp<ViewStyle>
}

export const HoliIcon: React.FC<HoliIconProps> = ({
  color = '#262424',
  icon: SvgIcon,
  size = 24,
  loading = false,
  testID,
  style,
}: HoliIconProps) => {
  if (loading)
    return (
      <View testID={testID} style={style}>
        <HoliSkeleton width={size ?? 24} height={size ?? 24} borderRadius={size ?? 24} />
      </View>
    )
  return (
    <View testID={testID} style={style}>
      <SvgIcon width={size} height={size} color={color} />
    </View>
  )
}
