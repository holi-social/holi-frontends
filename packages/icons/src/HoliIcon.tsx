import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliIconProps = {
  icon: HoliIconType
  filled?: boolean
  size?: number
  color?: string
  testID?: string
  style?: StyleProp<ViewStyle>
}

export const HoliIcon: React.FC<HoliIconProps> = ({
  color,
  icon: SvgIcon,
  size = 24,
  testID,
  style,
}: HoliIconProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View testID={testID} style={style}>
      <SvgIcon width={size} height={size} color={color || colors.foreground30} />
    </View>
  )
}
