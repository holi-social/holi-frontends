import React from 'react'
import { Platform } from 'react-native'

import { styleVars } from '@holi/ui/styles/globalVars'

const defaultTheme = {
  dark: false,
  colors: {
    ...styleVars,
  },
  fontFamily: {
    paragraph: Platform.select({
      web: 'Helvetica Neue, sans-serif',
      // android: 'Arial', // TODO find nice android system font
      ios: 'SF Pro',
    }),
    default: Platform.select({
      default: 'Circular Std, Helvetica Neue, sans-serif',
    }),
  },
  font: {
    textSize: 16,
  },
  chip: {
    borderRadius: 8,
    borderRadiusChecked: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    lineHeight: 24,
    iconSize: 15,
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
