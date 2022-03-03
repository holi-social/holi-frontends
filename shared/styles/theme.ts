import React from 'react'
import { Platform } from 'react-native'
import { styleVars } from 'shared/styles/globalVars'

const defaultTheme = {
  dark: false,
  colors: {
    primary: styleVars.primaryColor,
    background: '#f2f2f2',
    card: '#fff',
    text: styleVars.fontColor,
    border: styleVars.borderColor,
    buttonBorderColor: styleVars.buttonBorderColor,
    notification: styleVars.primaryColor,
  },
  fontFamily: {
    paragraph: Platform.select({
      web: 'Helvetica Neue, sans-serif',
      android: 'Arial', // TODO find nice android system font
      ios: 'Apple Braille'
    }),
  },
}

const ThemeContext = React.createContext(defaultTheme)
export const ThemeProvider = ThemeContext.Provider
export const ThemeConsumer = ThemeContext.Consumer

export const useTheme = () => React.useContext(ThemeContext)

export default defaultTheme
