import * as React from 'react'
import { Platform, StyleSheet, Text, ViewStyle } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { AccessibilityPropsWeb } from '@holi/ui/typings'

export type HeadingProps = {
  children: React.ReactChild | React.ReactChildren | (React.ReactChild | string | undefined)[]
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
  level?: number
  testID?: string
}

const HoliHeading: React.FunctionComponent<HeadingProps> = (props: HeadingProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const accessibilityProps: AccessibilityPropsWeb = {
    accessibilityRole: 'header',
    accessibilityLevel: props.level || 2,
  }

  return (
    <Text style={[styles.holiHeading, props.style]} {...accessibilityProps}>
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
