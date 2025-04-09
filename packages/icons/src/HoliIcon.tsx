import type React from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import type { TextColor } from 'holi-bricks/components/text'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'

export type HoliIconProps = {
  icon: HoliIconType
  filled?: boolean
  size?: number | { width: number; height: number }
  color?: TextColor
  /** Use this if you need to provide an explicit color and/or manually manage the color for each theme  */
  colorOverride?: string
  testID?: string
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
}

export const HoliIcon: React.FC<HoliIconProps> = ({
  color = 'main',
  colorOverride,
  icon: SvgIcon,
  size = 24,
  testID,
  style,
  accessibilityLabel,
}: HoliIconProps) => {
  const { styles } = useStyles(stylesheet)
  const width = typeof size === 'number' ? size : size.width
  const height = typeof size === 'number' ? size : size.height

  return (
    <View testID={testID} style={style} accessibilityLabel={accessibilityLabel}>
      <SvgIcon width={width} height={height} color={styles.icon(color, colorOverride).color} />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  icon: (color: TextColor, colorOverride?: string) => {
    return {
      color: colorOverride ?? theme.colors.fill[color],
    }
  },
}))
