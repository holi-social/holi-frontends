import * as React from 'react'
import { AccessibilityProps, Platform, Text, TextStyle } from 'react-native'

import { getHoliTextStyles as getStyles } from '@holi/ui/components/HoliText/HoliText.styles'
import { HoliTextType, HoliTextTypes } from '@holi/ui/components/HoliText/HoliText.types'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliTextProps = {
  children?: React.ReactNode
  type?: keyof typeof HoliTextTypes
  isAccessible?: boolean
  styles?: TextStyle | TextStyle[]
  selectable?: boolean
  [x: string]: any
}

const HoliText = ({
  children,
  type = HoliTextType.body,
  isAccessible = true,
  selectable = true,
  ...props
}: HoliTextProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const accessibilityProps = Platform.select({
    web: {
      accessible: isAccessible,
      ...(HoliTextTypes[type].role && { accessibilityRole: HoliTextTypes[type].role }),
      ...(!!HoliTextTypes[type].level && { accessibilityLevel: HoliTextTypes[type].level }),
    },
    default: {
      accessible: isAccessible,
      ...(HoliTextTypes[type].role && { accessibilityRole: HoliTextTypes[type].role }),
    },
  })

  return (
    <Text
      {...accessibilityProps}
      {...props}
      selectable={selectable}
      style={[styles.default, styles[HoliTextType[type]], props?.styles]}
    >
      {children}
    </Text>
  )
}

export default HoliText
