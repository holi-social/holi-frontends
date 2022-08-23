import React from 'react'

import { HoliTheme } from '.'
import { useStyleMixins } from './mixins'
import defaultTheme, { ThemeContext } from './theme'

export const ThemeProvider: React.FunctionComponent<{
  theme?: HoliTheme
}> = ({ children, theme = defaultTheme }) => {
  const [isDark, toggleDarkMode] = React.useReducer((isDark) => !isDark, defaultTheme.dark)
  const mixins = useStyleMixins()

  return (
    <ThemeContext.Provider value={{ theme: { ...theme, dark: isDark, mixins }, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
