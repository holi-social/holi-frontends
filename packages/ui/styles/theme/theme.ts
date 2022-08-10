import React from 'react'
import { Platform } from 'react-native'

import { vars } from '@holi/ui/styles/globalVars'

const defaultTheme = {
  dark: false,
  fontFamily: {
    default: (variant?: string) =>
      Platform.select({
        web: vars.fontFamilyWeb,
        default: variant ? `${vars.fontFamilyMobile} ${variant}` : vars.fontFamilyMobile,
      }) as string,
  },
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
