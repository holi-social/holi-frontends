import type React from 'react'
import { type StyleProp, View, type ViewStyle, useWindowDimensions } from 'react-native'

import HoliText, { type HoliTextColor, type HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'

export interface HeaderTitleProps extends Partial<HoliTextProps> {
  style?: StyleProp<ViewStyle>
  tintColor?: string
  color?: HoliTextColor
  widthOfScreen?: number
  testID?: string
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ children, tintColor, widthOfScreen, size, style, ...props }) => {
  const { theme } = useTheme()
  const { colors } = theme
  const { width: screenWidth } = useWindowDimensions()
  const titleWidth = widthOfScreen ? Math.min(1, widthOfScreen) * screenWidth : undefined

  return (
    <View style={{ width: titleWidth }}>
      <HoliText
        adjustsFontSizeToFit
        minimumFontScale={0.5}
        bold={size !== 'large'}
        size={size}
        {...props}
        numberOfLines={1}
        style={[{ color: tintColor || colors.foreground30 }, style]}
      >
        {children}
      </HoliText>
    </View>
  )
}

export default HeaderTitle
