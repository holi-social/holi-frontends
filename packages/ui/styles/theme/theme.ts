import React from 'react'
import { Platform } from 'react-native'

import { styleVars } from '@holi/ui/styles/globalVars'

const defaultTheme = {
  dark: false,
  colors: {
    ...styleVars.color,
  },
  fontFamily: {
    default: (variant = '') =>
      Platform.select({
        web: styleVars.var.fontFamilyWeb,
        default: variant.length > 0 ? `${styleVars.var.fontFamilyMobile} ${variant}` : styleVars.var.fontFamilyMobile,
      }),
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
