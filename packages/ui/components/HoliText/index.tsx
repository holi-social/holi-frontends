import * as React from 'react'
import { Platform, Text, TextStyle } from 'react-native'

import { getHoliTextStyles as getStyles } from '@holi/ui/components/HoliText/HoliText.styles'
import { HoliTextType, HoliTextTypes } from '@holi/ui/components/HoliText/HoliText.types'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliTextProps = {
  children: React.ReactChild | React.ReactChild[] | string
  type?: keyof typeof HoliTextTypes
  isAccessible?: boolean
  styles?: TextStyle
}

const HoliText = ({ children, type = HoliTextType.label, isAccessible = true, ...props }: HoliTextProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const getAccessibilityProps = () =>
    Platform.select({
      web: {
        accessible: isAccessible,
        accessibilityRole: HoliTextTypes[type].role,
        accessibilityLevel: HoliTextTypes[type].level,
      },
      default: {
        accessible: isAccessible,
        accessibilityRole: HoliTextTypes[type].role,
      },
    })

  return (
    <Text style={[styles.default, styles[HoliTextType[type]], props?.styles]} {...getAccessibilityProps()} {...props}>
      {children}
    </Text>
  )
}

export default HoliText
