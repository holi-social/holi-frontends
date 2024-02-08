import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliIconProps = {
  icon: HoliIconType
  filled?: boolean
  size?: number
  color?: string
  testID?: string
  style?: StyleProp<ViewStyle>
}

export const HoliIcon: React.FC<HoliIconProps> = ({
  color = colors.gray300,
  icon: SvgIcon,
  size = 24,
  testID,
  style,
}: HoliIconProps) => {
  return (
    <View testID={testID} style={style}>
      <SvgIcon width={size} height={size} color={color} />
    </View>
  )
}
