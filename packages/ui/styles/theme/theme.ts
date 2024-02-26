import React from 'react'
import { Platform } from 'react-native'

import { colors, fonts } from '@holi/ui/styles/globalVars'

const defaultTheme = {
  dark: false,
  fontFamily: {
    default: (variant?: string) =>
      Platform.select({
        web: fonts.fontFamilyWeb,
        default: variant ? `${fonts.fontFamilyMobile} ${variant}` : fonts.fontFamilyMobile,
      }) as string,
  },
  colors,
}

export type HoliTheme = typeof defaultTheme

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

export default defaultTheme
