import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliIconProps = {
  icon: HoliIconType
  filled?: boolean
  size?: number | { width: number; height: number }
  color?: string
  testID?: string
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
}

export const HoliIcon: React.FC<HoliIconProps> = ({
  color,
  icon: SvgIcon,
  size = 24,
  testID,
  style,
  accessibilityLabel,
}: HoliIconProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  const width = typeof size === 'number' ? size : size.width
  const height = typeof size === 'number' ? size : size.height

  return (
    <View testID={testID} style={style} accessibilityLabel={accessibilityLabel}>
      <SvgIcon width={width} height={height} color={color || colors.foreground30} />
    </View>
  )
}
