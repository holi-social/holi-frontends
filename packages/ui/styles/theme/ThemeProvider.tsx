import React, { useCallback, useMemo, useState } from 'react'

import colorsDark from '@holi/ui/styles/globalVars/colors.dark'
import colorsLight from '@holi/ui/styles/globalVars/colors.light'
import { setColorScheme, useColorScheme } from '@holi/ui/styles/theme/colors'

import { HoliTheme } from '.'
import { useStyleMixins } from './mixins'
import defaultTheme, { ThemeContext } from './theme'

type ModalState = { [key: string]: boolean }

export const ThemeProvider = ({ children, theme = defaultTheme }: React.PropsWithChildren<{ theme?: HoliTheme }>) => {
  const [mode, setMode] = useState(useColorScheme())
  const isDark = mode === 'dark'
  // console.log('ThemeProvider', { isDark })

  const toggleDarkMode = () => {
    const newMode = isDark ? 'light' : 'dark'
    setColorScheme(newMode)
    setMode(newMode)
  }

  const colors = useMemo(() => (isDark ? colorsDark : colorsLight), [isDark])

  const [modalCurrentStatus, setModalCurrentStatus] = React.useState<ModalState>({})
  const anyModalOpen = useMemo(() => Object.values(modalCurrentStatus).some((value) => value), [modalCurrentStatus])
  const mixins = useStyleMixins()

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
        theme: { ...theme, dark: isDark, mixins, colors },
        toggleDarkMode,
        modalIsOpen: anyModalOpen,
        setModalIsOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
