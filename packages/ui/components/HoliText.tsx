import * as React from 'react'
import { AccessibilityProps, AccessibilityRole, Platform, Text, TextStyle } from 'react-native'
import { StyleSheet } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/react-native-web'
import { useTheme } from '@holi/ui/styles/theme'
import { HoliTheme } from '@holi/ui/styles/theme'

type HoliTextSize = 'large' | 'default' | 'small' | 'extrasmall' // for working code completion in vscode
export const HoliTextSizes: HoliTextSize[] = ['large', 'default', 'small', 'extrasmall'] // keep in sync with all possible HoliTextSize values

export type HoliTextProps = {
  children?: React.ReactNode
  size?: HoliTextSize
  bold?: boolean
  styles?: TextStyle | TextStyle[]
  selectable?: boolean
  [x: string]: any
}

const HoliText = ({ children, size = 'default', bold = false, selectable = true, ...props }: HoliTextProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  return (
    <Text
      accessible={false}
      {...props}
      selectable={selectable}
      style={[styles.base, styles[size as keyof typeof styles], bold ? styles.bold : {}, props?.styles]}
    >
      {children}
    </Text>
  )
}

export default HoliText

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    base: {
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: theme.colors.softblack,
    },
    large: {
      fontSize: 21,
      lineHeight: 21 * 1.2,
    },
    default: {
      fontSize: 16,
      lineHeight: 16 * 1.2,
    },
    small: {
      fontSize: 14,
      lineHeight: 14 * 1.2,
    },
    extrasmall: {
      fontSize: 12,
      lineHeight: 12 * 1.2,
    },
    bold: {
      fontWeight: '500',
      fontFamily: theme.fontFamily.default('Medium'),
    },
  })
