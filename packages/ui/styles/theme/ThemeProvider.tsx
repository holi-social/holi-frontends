import React, { useCallback, useEffect } from 'react'
import { Platform } from 'react-native'

import { HoliTheme } from '.'
import { useStyleMixins } from './mixins'
import defaultTheme, { ThemeContext } from './theme'

export const ThemeProvider = ({ children, theme = defaultTheme }: React.PropsWithChildren<{ theme?: HoliTheme }>) => {
  const [isDark, toggleDarkMode] = React.useReducer((isDark) => !isDark, defaultTheme.dark)
  const [openModalList, setOpenModalList] = React.useState<string[]>([])
  const modalIsOpen = !!openModalList.length
  const mixins = useStyleMixins()

  const setModalIsOpen = useCallback((modalId: string, isOpen: boolean) => {
    setOpenModalList((currentList) => {
      // use Set to avoid duplications
      const modalSet = new Set(currentList)
      isOpen ? modalSet.add(modalId) : modalSet.delete(modalId)
      return Array.from(modalSet)
    })
  }, [])

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.style.overflow = modalIsOpen ? 'hidden' : ''
    }
  }, [modalIsOpen])

  return (
    <ThemeContext.Provider
      value={{
        theme: { ...theme, dark: isDark, mixins },
        toggleDarkMode,
        modalIsOpen,
        setModalIsOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
