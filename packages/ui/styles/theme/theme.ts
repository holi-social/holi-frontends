import React from 'react'
import { Platform } from 'react-native'

import { styleVars } from '@holi/ui/styles/globalVars'

const defaultTheme = {
  dark: false,
  colors: {
    text: styleVars.fontColor,
    textBlack: styleVars.fontColor,
    textGrey: styleVars.fontColorGrey,
    textWhite: styleVars.fontColorWhite,
    primary: styleVars.primaryColor,
    secondary: styleVars.secondaryColor,
    tertiary: styleVars.tertiaryColor,
    border: styleVars.borderColor,
    background: styleVars.backgroundColor,
    backgroundGrey: styleVars.backgroundColorGrey,
    backgroundBlack: styleVars.backgroundColorBlack,
  },
  fontFamily: {
    paragraph: Platform.select({
      web: 'Helvetica Neue, sans-serif',
      // android: 'Arial', // TODO find nice android system font
      ios: 'SF Pro',
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
