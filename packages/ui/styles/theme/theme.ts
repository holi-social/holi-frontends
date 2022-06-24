import React from 'react'
import { Platform } from 'react-native'

import { styleVars } from '@holi/ui/styles/globalVars'

const defaultTheme = {
  dark: false,
  colors: {
    ...styleVars.colors,
  },
  vars: {
    ...styleVars.vars,
  },
  fontFamily: {
    default: (variant = '') =>
      Platform.select({
        web: styleVars.vars.fontFamilyWeb,
        default: variant.length > 0 ? `${styleVars.vars.fontFamilyMobile} ${variant}` : styleVars.vars.fontFamilyMobile,
      }).toString(),
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
