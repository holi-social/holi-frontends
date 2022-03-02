import React from 'react'
import { styleVars } from './globalVars'
import { Platform } from 'react-native'

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
      android: 'Helvetica',
      ios: 'Apple Braille'
    }),
  },
}

const ThemeContext = React.createContext(defaultTheme)
export const ThemeProvider = ThemeContext.Provider
export const ThemeConsumer = ThemeContext.Consumer

export const useTheme = () => React.useContext(ThemeContext)

export default defaultTheme
