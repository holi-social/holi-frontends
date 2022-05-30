import * as React from 'react'
import { AccessibilityProps, Platform, StyleSheet, Text, ViewStyle } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/react-native-web'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HeadingProps = {
  children: React.ReactChild | React.ReactChildren | (React.ReactChild | string | undefined)[]
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
  level?: number
  testID?: string
}

const HoliHeading: React.FunctionComponent<HeadingProps> = (props: HeadingProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const getAccessibilityProps = (): AccessibilityProps | AccessibilityPropsWeb =>
    Platform.select({
      // mobile
      // accessibilityRole = 'header' plus level renders to '<h1 role="heading">'
      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/heading_role
      native: { accessible: true, accessibilityRole: 'header' },
      // web
      // accessibilityRole = 'header' plus level renders to '<h1 role="heading">'
      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/heading_role
      default: { accessible: true, accessibilityRole: 'header', accessibilityLevel: props.level || 2 },
    })

  return (
    <Text style={[styles.holiHeading, props.style]} {...getAccessibilityProps()}>
      {props.children}
    </Text>
  )
}

export default HoliHeading

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    holiHeading: {
      fontSize: 34,
      color: theme.colors.fontColorBlack,
      textAlign: 'center',
    },
  })
