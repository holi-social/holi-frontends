import { Platform } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import type { HoliTheme } from '@holi/ui/styles/theme'

export const getCommonStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    headerTextShadow: Platform.select({
      native: {
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
      default: {},
    }),
  })
