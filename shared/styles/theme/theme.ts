import React from 'react'
import { Platform } from 'react-native'
import { styleVars } from 'shared/styles/globalVars'

const defaultTheme = {
  dark: false,
  colors: {
    primary: styleVars.primaryColor,
    background: styleVars.backgroundColor,
    card: '#fff',
    text: styleVars.fontColor,
    border: styleVars.borderColor,
    buttonBorderColor: styleVars.buttonBorderColor,
    notification: styleVars.primaryColor,
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
