import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import HoliText, { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export interface HeaderTitleProps extends Partial<HoliTextProps> {
  style?: StyleProp<ViewStyle>
  tintColor?: string
  color?: string
  testID?: string
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ children, tintColor = colors.fontColorBlack, style, ...props }) => {
  return (
    <HoliText bold {...props} style={[{ color: tintColor }, style]}>
      {children}
    </HoliText>
  )
}

export default HeaderTitle
