import { Platform } from 'react-native'

import { fonts } from '@holi/ui/styles/globalVars'
import colorsLight from '@holi/ui/styles/globalVars/colors.light'

// light theme is default, hence dark false and colors lightColors. Will change if we start using prefers-color-scheme
const defaultTheme = {
  dark: false,
  fontFamily: {
    default: (variant?: string) =>
      Platform.select({
        web: fonts.fontFamilyWeb,
        default: variant ? `${fonts.fontFamilyMobile} ${variant}` : fonts.fontFamilyMobile,
      }) as string,
  },
  colors: colorsLight,
}

export type HoliTheme = typeof defaultTheme

export default defaultTheme
