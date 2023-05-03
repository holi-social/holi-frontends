import React, { useCallback, useMemo } from 'react'

import { HoliTheme } from '.'
import { useStyleMixins } from './mixins'
import defaultTheme, { ThemeContext } from './theme'

type ModalState = { [key: string]: boolean }

export const ThemeProvider = ({ children, theme = defaultTheme }: React.PropsWithChildren<{ theme?: HoliTheme }>) => {
  const [isDark, toggleDarkMode] = React.useReducer((isDark) => !isDark, defaultTheme.dark)
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
        theme: { ...theme, dark: isDark, mixins },
        toggleDarkMode,
        modalIsOpen: anyModalOpen,
        setModalIsOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
