import { StyleSheet } from 'react-native'

import { fontStylesByHoliTextSize } from '@holi/ui/components/atoms/HoliText'
import { HoliTheme } from '@holi/ui/styles/theme'

export const getBaseStyle = (theme: HoliTheme) =>
  StyleSheet.create({
    base: {
      color: theme.colors.foreground20,
      fontFamily: theme.fontFamily.default('Regular'),
      fontSize: fontStylesByHoliTextSize['small'].fontSize,
      lineHeight: fontStylesByHoliTextSize['small'].lineHeight,
    },
  })

export const getTagStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    b: {
      color: theme.colors.foreground30,
      fontWeight: '500',
      fontFamily: theme.fontFamily.default('Medium'),
    },
  })
