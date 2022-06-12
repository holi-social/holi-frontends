import * as React from 'react'
import { Platform, StyleSheet, Text, TextStyle } from 'react-native'

import { getHoliTextStyles as getStyles } from '@holi/ui/components/HoliText/HoliText.styles'
import {
  HoliTextAccessibilityLevels,
  HoliTextAccessibilityRoles,
  HoliTextTypes,
} from '@holi/ui/components/HoliText/HoliText.types'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliTextProps = {
  children: React.ReactChild | React.ReactChild[] | React.ReactText | React.ReactText[] | string
  type?: keyof typeof HoliTextTypes
  isAccessible?: boolean
  styles?: TextStyle
}

const HoliText = ({ children, type = HoliTextTypes.label, isAccessible = true, ...props }: HoliTextProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const getAccessibilityProps = () =>
    Platform.select({
      web: {
        accessible: isAccessible,
        accessibilityRole: HoliTextAccessibilityRoles[type],
        accessibilityLevel: HoliTextAccessibilityLevels[type],
      },
      default: {
        accessible: isAccessible,
        accessibilityRole: HoliTextAccessibilityRoles[type],
      },
    })

  return (
    <Text style={[styles.default, styles[HoliTextTypes[type]], props?.styles]} {...getAccessibilityProps()} {...props}>
      {children}
    </Text>
  )
}

export default HoliText
