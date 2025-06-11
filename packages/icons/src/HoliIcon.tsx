import type React from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { createStyleSheet } from 'holi-bricks/styles'
import type { FillColors } from 'holi-bricks/foundations/colors/themes/types'

export type HoliIconProps = {
  icon: HoliIconType
  filled?: boolean
  size?: number | { width: number; height: number }
  color?: FillColors
  /** Use this if you need to provide an explicit color and/or manually manage the color for each theme  */
  colorOverride?: string
  testID?: string
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
  shadow?: 'light' | 'dark'
}

export const HoliIcon: React.FC<HoliIconProps> = ({
  color = 'main',
  colorOverride,
  icon: SvgIcon,
  size = 24,
  testID,
  style,
  accessibilityLabel,
  shadow,
}: HoliIconProps) => {
  const width = typeof size === 'number' ? size : size.width
  const height = typeof size === 'number' ? size : size.height

  return (
    <View testID={testID} style={style} accessibilityLabel={accessibilityLabel}>
      {!!shadow && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <SvgIcon
            width={width * 1.1}
            height={height * 1.1}
            color={shadow === 'dark' ? 'black' : 'white'}
            opacity="0.2"
            transform="translate(-1, 1)"
          />
        </View>
      )}
      <SvgIcon width={width} height={height} color={styles.icon(color, colorOverride).color} />
    </View>
  )
}

const styles = createStyleSheet((theme) => ({
  icon: (color: HoliIconProps['color'], colorOverride?: string) => {
    const iconColor = color ? theme.colors.fill[color] : undefined
    return {
      color: colorOverride ?? iconColor,
    }
  },
}))
