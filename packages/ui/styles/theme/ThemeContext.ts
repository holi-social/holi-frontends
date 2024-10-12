import React from 'react'

import defaultTheme, { type HoliTheme } from '@holi/ui/styles/theme/theme'

export const ThemeContext = React.createContext<{
  theme: HoliTheme
  toggleDarkMode: () => void
  modalIsOpen: boolean
  setModalIsOpen: (modalId: string, isOpen: boolean) => void
}>({
  theme: defaultTheme,
  toggleDarkMode: () => null,
  modalIsOpen: false,
  setModalIsOpen: () => false,
})
ThemeContext.displayName = 'ThemeContext'

export const ThemeConsumer = ThemeContext.Consumer

export const useTheme = () => React.useContext(ThemeContext)
