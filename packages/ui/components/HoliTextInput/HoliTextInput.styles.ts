import { StyleSheet } from 'react-native'

import { HoliTheme } from '@holi/ui/styles/theme'

export const getHoliTextInputStyles = (
  theme: HoliTheme,
  isErrored: boolean,
  isFocused: boolean,
  isFullWidth: boolean,
  isHovered: boolean
) =>
  StyleSheet.create({
    input: {
      borderWidth: 2,
      borderColor: isErrored
        ? theme.colors.errorRed
        : isFocused
        ? theme.colors.positivepurple
        : theme.colors.softblackTransparent,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 17,
      fontSize: 16,
      lineHeight: 16 * 1.4,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      marginBottom: 6,
      color: theme.colors.softblack,
      caretWidth: 2,
      caretColor: theme.colors.positivepurple,
      width: isFullWidth ? '100%' : 'auto',
    },
    label: {
      color: isErrored ? theme.colors.errorRed : isFocused ? theme.colors.positivepurple : theme.colors.softblack,
      marginBottom: 6,
    },
    helperText: {
      color: isErrored ? theme.colors.errorRed : theme.colors.greyAAA,
    },
  })
