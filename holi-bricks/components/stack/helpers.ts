import type { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types/core'

export const resolveBackgroundColor = (colorKey: string, theme: UnistylesTheme) => {
  if (colorKey in theme.colors.bg) {
    return theme.colors.bg[colorKey as keyof typeof theme.colors.bg]
  }
  if (colorKey in theme.colors.decorative) {
    return theme.colors.decorative[colorKey as keyof typeof theme.colors.decorative]
  }
  return undefined
}
