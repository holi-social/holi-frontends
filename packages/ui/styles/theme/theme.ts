import React from 'react'
import { Platform, StyleSheet } from 'react-native'

import { vars } from '@holi/ui/styles/globalVars'

const defaultTheme = {
  dark: false,
  fontFamily: {
    default: (variant = '') =>
      Platform.select({
        web: vars.fontFamilyWeb,
        default: variant.length > 0 ? `${vars.fontFamilyMobile} ${variant}` : vars.fontFamilyMobile,
      }) as string,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mixins: {} as StyleSheet.NamedStyles<any>,
}

export type HoliTheme = typeof defaultTheme

export const ThemeContext = React.createContext<{
  theme: HoliTheme
  toggleDarkMode: () => void
}>({
  theme: defaultTheme,
  toggleDarkMode: () => null,
})

export const ThemeConsumer = ThemeContext.Consumer

export const useTheme = () => React.useContext(ThemeContext)

export default defaultTheme
