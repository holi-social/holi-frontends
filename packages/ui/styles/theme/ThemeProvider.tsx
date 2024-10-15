import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { UnistylesRuntime } from 'react-native-unistyles'

import colorsDark from '@holi/ui/styles/globalVars/colors.dark'
import colorsLight from '@holi/ui/styles/globalVars/colors.light'
import { ThemeContext } from '@holi/ui/styles/theme/ThemeContext'
import { getColorScheme, setColorScheme } from '@holi/ui/styles/theme/colors'
import defaultTheme, { HoliTheme } from '@holi/ui/styles/theme/theme'

type ModalState = { [key: string]: boolean }

export const ThemeProvider = ({ children, theme = defaultTheme }: React.PropsWithChildren<{ theme?: HoliTheme }>) => {
  const [mode, setMode] = useState<string>()
  const isDark = mode === 'dark'

  // get current theme on initialization
  useEffect(() => {
    if (!mode) {
      getColorScheme().then((scheme) => setMode(scheme))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleDarkMode = () => {
    const newMode = isDark ? 'light' : 'dark'
    setColorScheme(newMode)
    setMode(newMode)
  }

  useEffect(() => {
    if (mode === 'dark' || mode === 'light') {
      UnistylesRuntime.setTheme(mode)
    }
  }, [mode])

  const colors = useMemo(() => (isDark ? colorsDark : colorsLight), [isDark])

  const [modalCurrentStatus, setModalCurrentStatus] = React.useState<ModalState>({})
  const anyModalOpen = useMemo(() => Object.values(modalCurrentStatus).some((value) => value), [modalCurrentStatus])

  const setModalIsOpen = useCallback((modalId: string, isOpen: boolean) => {
    setModalCurrentStatus((currentMap: ModalState) => {
      if (isOpen) {
        currentMap[modalId] = isOpen
      } else {
        delete currentMap[modalId]
      }
      return { ...currentMap }
    })
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme: { ...theme, dark: isDark, colors },
        toggleDarkMode,
        modalIsOpen: anyModalOpen,
        setModalIsOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
