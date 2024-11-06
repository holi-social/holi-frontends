import { Platform } from 'react-native'

import { fonts } from '@holi/ui/styles/globalVars'
import colorsLight from '@holi/ui/styles/globalVars/colors.light'

// light theme is default, hence dark false and colors lightColors. Will change if we start using prefers-color-scheme
const defaultTheme = {
  dark: false,
  fontFamily: {
    default: (variant = 'Regular') =>
      Platform.select({
        web: `${fonts.fontFamilyBase}-${variant},${fonts.fontFamilyWebFallbacks}`,
        default: `${fonts.fontFamilyBase}-${variant}`,
      }) as string,
  },
  colors: colorsLight,
}

export type HoliTheme = typeof defaultTheme

export default defaultTheme
