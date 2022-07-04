import * as React from 'react'
import { AccessibilityProps, Platform, StyleSheet, Text, TextStyle } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/react-native-web'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type HoliHeadingLevel = 1 | 2 | 3 // for working code completion in vscode
type HoliHeadingSize = 'super' | 'large' | 'medium' | 'small' // for working code completion in vscode

const HoliHeadings: Record<HoliHeadingSize, { defaultLevel: HoliHeadingLevel }> = {
  super: {
    defaultLevel: 1,
  },
  large: {
    defaultLevel: 1,
  },
  medium: {
    defaultLevel: 2,
  },
  small: {
    defaultLevel: 3,
  },
}

export const HoliHeadingSizes: HoliHeadingSize[] = Object.keys(HoliHeadings) as HoliHeadingSize[]
export const HoliHeadingLevels: HoliHeadingLevel[] = Object.values(HoliHeadings)
  .map((h) => h.defaultLevel)
  .filter((value, index, self) => self.indexOf(value) === index)

export type HoliHeadingProps = {
  children?: React.ReactNode
  size?: HoliHeadingSize
  level?: HoliHeadingLevel
  styles?: TextStyle | TextStyle[]
  selectable?: boolean
  testID?: string
}

const HoliHeading = ({
  children,
  size = 'large',
  level = HoliHeadings.large.defaultLevel,
  selectable = true,
  ...props
}: HoliHeadingProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = Platform.select({
    web: {
      accessibilityRole: 'header',
      accessibilityLevel: level,
    },
    default: {
      role: 'header',
    },
  })

  return (
    <Text
      {...accessibilityProps}
      selectable={selectable}
      style={[styles.default, styles[size as keyof typeof styles], props?.styles]}
      {...(props.testID && { testID: props.testID })}
    >
      {children}
    </Text>
  )
}

export default HoliHeading

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    default: {
      fontWeight: '500',
      fontFamily: theme.fontFamily.default('Medium'),
      color: theme.colors.softblack,
    },
    super: {
      fontSize: 36,
      lineHeight: 36 * 1.2,
    },
    large: {
      fontSize: 28,
      lineHeight: 28 * 1.2,
    },
    medium: {
      fontSize: 21,
      lineHeight: 21 * 1.2,
    },
    small: {
      fontSize: 16,
      lineHeight: 16 * 1.4,
    },
  })
