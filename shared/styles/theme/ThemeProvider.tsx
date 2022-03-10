import React from 'react'
import { HoliTheme } from '.'
import defaultTheme, { ThemeContext } from './theme'

export const ThemeProvider: React.FunctionComponent<{
  theme?: HoliTheme
}> = ({ children, theme = defaultTheme }) => {
  const [isDark, toggleDarkMode] = React.useReducer((isDark) => !isDark, defaultTheme.dark)
  return (
    <ThemeContext.Provider value={{ theme: { ...theme, dark: isDark }, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
