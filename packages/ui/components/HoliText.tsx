import * as React from 'react'
import { Platform, StyleSheet, Text, TextStyle } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface HoliTextTypeInfo {
  name: string
  level?: number
  role?: string
}

export enum HoliTextType {
  super = 'super',
  heading1 = 'heading1',
  heading2 = 'heading2',
  heading3 = 'heading3',
  button = 'button',
  body = 'body',
  captionLink = 'captionLink',
  caption = 'caption',
  labelLink = 'labelLink',
  label = 'label',
}

export const HoliTextTypes: Record<HoliTextType, HoliTextTypeInfo> = {
  [HoliTextType.super]: { name: HoliTextType.super, level: 1, role: 'header' },
  [HoliTextType.heading1]: { name: HoliTextType.heading1, level: 1, role: 'header' },
  [HoliTextType.heading2]: { name: HoliTextType.heading2, level: 2, role: 'header' },
  [HoliTextType.heading3]: { name: HoliTextType.heading3, level: 3, role: 'header' },
  [HoliTextType.button]: { name: HoliTextType.button },
  [HoliTextType.body]: { name: HoliTextType.body },
  [HoliTextType.captionLink]: { name: HoliTextType.captionLink },
  [HoliTextType.caption]: { name: HoliTextType.caption },
  [HoliTextType.labelLink]: { name: HoliTextType.labelLink },
  [HoliTextType.label]: { name: HoliTextType.label },
}

export type HoliTextProps = {
  children?: React.ReactNode
  type?: keyof typeof HoliTextTypes
  isAccessible?: boolean
  styles?: TextStyle | TextStyle[]
  [x: string]: any
}

const HoliText = ({ children, type = HoliTextType.body, isAccessible = true, ...props }: HoliTextProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const getAccessibilityProps = Platform.select({
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
    <Text {...getAccessibilityProps} {...props} style={[styles.default, styles[HoliTextType[type]], props?.styles]}>
      {children}
    </Text>
  )
}

export default HoliText

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    default: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 16 * 1.2,
      fontFamily: theme.fontFamily.default('Medium'),
    },
    super: {
      fontSize: 36,
      lineHeight: 36 * 1.2,
    },
    heading1: {
      fontSize: 28,
      lineHeight: 28 * 1.2,
    },
    heading2: {
      fontSize: 21,
      lineHeight: 21 * 1.2,
    },
    heading3: {
      lineHeight: 16 * 1.4,
    },
    button: {
      fontSize: 21,
      lineHeight: 21 * 1.2,
    },
    body: {
      lineHeight: 16 * 1.4,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
    },
    captionLink: {
      fontSize: 14,
      lineHeight: 14 * 1.2,
    },
    caption: {
      fontSize: 14,
      lineHeight: 14 * 1.2,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
    },
    labelLink: {
      fontSize: 12,
      lineHeight: 12 * 1.2,
    },
    label: {
      fontSize: 12,
      lineHeight: 12 * 1.2,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
    },
  })
