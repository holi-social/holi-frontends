import { StyleSheet } from 'react-native'

import { HoliTheme } from '@holi/ui/styles/theme'

interface TextInputStylesProps {
  theme: HoliTheme
  isHovered?: boolean
  isFocused?: boolean
  isErrored?: boolean
  isDisabled?: boolean
  isInline?: boolean
}

export const inputLineHeight = 16 * 1.4

export const getHoliTextInputStyles = ({
  theme,
  isHovered = false,
  isErrored = false,
  isFocused = false,
  isDisabled = false,
  isInline = false,
}: TextInputStylesProps) =>
  StyleSheet.create({
    pressable: {
      cursor: 'default',
    },
    inputWrapper: {
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: isDisabled
        ? theme.colors.softblackTransparent
        : isErrored
        ? theme.colors.errorRed
        : isFocused
        ? theme.colors.positivepurple
        : isHovered
        ? theme.colors.greyAA
        : theme.colors.softblackTransparent,
      borderRadius: 4,
      paddingHorizontal: 12,
      marginBottom: 6,
      paddingVertical: 17,
      backgroundColor: isDisabled ? theme.colors.lightGrey : theme.colors.white,
      alignSelf: isInline ? 'flex-start' : 'stretch',
    },
    input: {
      flex: 1,
      fontSize: 16,
      lineHeight: inputLineHeight,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: theme.colors.softblack,
      caretColor: theme.colors.positivepurple,
      overflow: 'scroll',
      alignSelf: isInline ? 'flex-start' : 'stretch',
    },
    label: {
      color: isErrored ? theme.colors.errorRed : isFocused ? theme.colors.positivepurple : theme.colors.softblack,
      marginBottom: 6,
      alignSelf: 'stretch',
    },
    helperText: {
      color: isErrored ? theme.colors.errorRed : theme.colors.greyAAA,
    },
    errorIconWrapper: {
      width: 24,
      height: 24,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    errorIcon: {
      width: 13.33,
      height: 13.33,
      backgroundColor: theme.colors.errorRed,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 13.33 / 2,
    },
    errorText: {
      color: theme.colors.white,
      fontSize: 8,
    },
  })
