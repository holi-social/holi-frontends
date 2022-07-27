import React from 'react'
import { useWindowDimensions } from 'react-native'

import { HoliTheme } from '.'
import { getMixins } from './mixins'
import defaultTheme, { ThemeContext } from './theme'

export const ThemeProvider: React.FunctionComponent<{
  theme?: HoliTheme
}> = ({ children, theme = defaultTheme }) => {
  const { width: screenWidth } = useWindowDimensions()
  const [isDark, toggleDarkMode] = React.useReducer((isDark) => !isDark, defaultTheme.dark)

  const mixins = getMixins(theme, screenWidth)

  return (
    <ThemeContext.Provider value={{ theme: { ...theme, dark: isDark, mixins }, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
