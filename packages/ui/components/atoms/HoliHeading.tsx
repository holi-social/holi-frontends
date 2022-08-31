import * as React from 'react'
import { AccessibilityProps, Platform, StyleSheet, Text, TextStyle } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type HoliHeadingLevel = '1' | '2' | '3' | '4' // for working code completion in vscode
type HoliHeadingSize = 'super' | 'large' | 'medium' | 'small' | 'xSmall' // for working code completion in vscode

const HoliHeadings: Record<HoliHeadingLevel, { defaultSize: HoliHeadingSize }> = {
  1: {
    defaultSize: 'large',
  },
  2: {
    defaultSize: 'medium',
  },
  3: {
    defaultSize: 'small',
  },
  4: {
    defaultSize: 'xSmall',
  },
}

export const HoliHeadingLevels: HoliHeadingLevel[] = Object.keys(HoliHeadings) as unknown as HoliHeadingLevel[]
export const HoliHeadingSizes: HoliHeadingSize[] = ['super', 'large', 'medium', 'small'] // keep in sync with type HoliHeadingSize

export type HoliHeadingProps = {
  children?: React.ReactNode
  size?: HoliHeadingSize
  level?: HoliHeadingLevel
  style?: TextStyle | TextStyle[]
  selectable?: boolean
  testID?: string
}

const HoliHeading: React.FC<HoliHeadingProps> = ({
  children,
  level = '2',
  size = HoliHeadings[level].defaultSize,
  selectable = true,
  testID,
  ...props
}) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = Platform.select({
    web: {
      accessibilityRole: 'header',
      accessibilityLevel: Number(level),
    },
    default: {
      role: 'header',
    },
  })

  return (
    <Text
      {...accessibilityProps}
      selectable={selectable}
      style={[styles.default, styles[size as keyof typeof styles], props?.style]}
      testID={testID}
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
      color: colors.softblack,
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
    xSmall: {
      fontSize: 14,
      lineHeight: 14 * 1.4,
    },
  })
