import React, { useCallback, useEffect } from 'react'
import { Platform } from 'react-native'

import { HoliTheme } from '.'
import { useStyleMixins } from './mixins'
import defaultTheme, { ThemeContext } from './theme'

export const ThemeProvider = ({ children, theme = defaultTheme }: React.PropsWithChildren<{ theme?: HoliTheme }>) => {
  const [isDark, toggleDarkMode] = React.useReducer((isDark) => !isDark, defaultTheme.dark)
  const [openModalList, setOpenModalList] = React.useState<string[]>([])
  const [modalCurrentStatus, setModalCurrentStatus] = React.useState<boolean>(false)
  const [modalIsOpen, setModalOpenStatus] = React.useState<boolean>(false)
  const mixins = useStyleMixins()

  const setModalIsOpen = useCallback((modalId: string, isOpen: boolean) => {
    setOpenModalList((currentList) => {
      setModalCurrentStatus(isOpen)
      // use Set to avoid duplications
      const modalSet = new Set(currentList)
      isOpen ? modalSet.add(modalId) : modalSet.delete(modalId)
      return Array.from(modalSet)
    })
  }, [])

  // This condition is added to fix the scrolling issue when loading the app after login
  useEffect(() => {
    setModalOpenStatus(!!openModalList.length && modalCurrentStatus)
  }, [openModalList, modalCurrentStatus])

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
