import React from 'react'
import { StyleProp, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliText, { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export interface HeaderTitleProps extends Partial<HoliTextProps> {
  style?: StyleProp<ViewStyle>
  tintColor?: string
  color?: string
  widthOfScreen?: number
  testID?: string
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  children,
  tintColor = colors.fontColorBlack,
  widthOfScreen,
  size,
  style,
  ...props
}) => {
  const { width: screenWidth } = useWindowDimensions()
  const titleWidth = widthOfScreen ? Math.min(1, widthOfScreen) * screenWidth : undefined

  return (
    <View style={{ width: titleWidth }}>
      <HoliText
        adjustsFontSizeToFit
        maxFontSizeMultiplier={0.5}
        bold={size === 'large' ? false : true}
        size={size}
        {...props}
        numberOfLines={2}
        style={[{ color: tintColor }, style]}
      >
        {children}
      </HoliText>
    </View>
  )
}

export default HeaderTitle
