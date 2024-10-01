import React, { ReactNode } from 'react'
import { UnistylesRuntime } from 'react-native-unistyles'

import colorsDark from '@holi/ui/styles/globalVars/colors.dark'
import colorsLight from '@holi/ui/styles/globalVars/colors.light'
import defaultTheme, { ThemeContext } from '@holi/ui/styles/theme'

type ThemeProviderProps = {
  children?: ReactNode
  dark?: boolean
  colors: typeof defaultTheme.colors
}

const ThemeProvider = ({ children, dark = false, colors }: ThemeProviderProps) => (
  <ThemeContext.Provider
    value={{
      theme: { ...defaultTheme, dark, colors },
      toggleDarkMode: () => {},
      modalIsOpen: false,
      setModalIsOpen: () => {},
    }}
  >
    <div style={{ padding: '2rem', backgroundColor: colors.background10, display: 'flex', gap: 10, alignItems: 'end' }}>
      {children}
    </div>
  </ThemeContext.Provider>
)

type ThemeWrapperProps = {
  children?: ReactNode
  showInLightMode?: boolean
  showInDarkMode?: boolean
}

const ThemeWrapper = ({ children, showInLightMode = true, showInDarkMode = false }: ThemeWrapperProps) => {
  //  TODO: we can only really use 1 theme at a time with Unistyles, so no both :(
  if (showInLightMode) {
    UnistylesRuntime.setTheme('light')
  } else {
    UnistylesRuntime.setTheme('dark')
  }

  return (
    <>
      {showInLightMode && (
        <ThemeProvider dark={false} colors={colorsLight}>
          {children}
        </ThemeProvider>
      )}
      {showInDarkMode && (
        <ThemeProvider dark={true} colors={colorsDark}>
          {children}
        </ThemeProvider>
      )}
    </>
  )
}

export const withTheme = (Story, { globals: { theme } }) => {
  return (
    <ThemeWrapper showInLightMode={['light', 'both'].includes(theme)} showInDarkMode={['dark', 'both'].includes(theme)}>
      <Story />
    </ThemeWrapper>
  )
}

export default ThemeWrapper
