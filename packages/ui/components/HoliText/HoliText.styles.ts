import { StyleSheet } from 'react-native'
import { HoliTheme } from '@holi/ui/styles/theme'

export const getHoliTextStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    default: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 16 * 1.2,
      fontFamily: theme.fontFamily.default,
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
    },
    captionLink: {
      fontSize: 14,
      lineHeight: 14 * 1.2,
    },
    caption: {
      fontSize: 14,
      lineHeight: 14 * 1.2,
      fontWeight: '450',
    },
    labelLink: {
      fontSize: 12,
      lineHeight: 12 * 1.2,
    },
    label: {
      fontSize: 12,
      lineHeight: 12 * 1.2,
      fontWeight: '450',
    },
  })
