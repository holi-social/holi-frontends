import { StyleSheet } from 'react-native'

import { HoliTheme } from '@holi/ui/styles/theme'

interface TextInputStylesProps {
  theme: HoliTheme
  isHovered?: boolean
  isFocused?: boolean
  hasValidationErrors?: boolean
  isDisabled?: boolean
  isInline?: boolean
}

export const inputLineHeight = 16 * 1.4

export const getHoliTextInputStyles = ({
  theme,
  isHovered = false,
  hasValidationErrors = false,
  isFocused = false,
  isDisabled = false,
  isInline = false,
}: TextInputStylesProps) =>
  StyleSheet.create({
    pressable: {
      cursor: 'default',
      alignSelf: isInline ? 'flex-start' : 'stretch',
    },
    inputWrapper: {
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: isDisabled
        ? theme.colors.softblackTransparent
        : hasValidationErrors
        ? theme.colors.errorRed
        : isFocused
        ? theme.colors.positivepurple
        : isHovered
        ? theme.colors.greyAA
        : theme.colors.softblackTransparent,
      borderRadius: 4,
      paddingHorizontal: 12,
      marginVertical: 6,
      paddingVertical: 13,
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
    inputCharsText: {
      position: 'absolute',
      paddingHorizontal: 8,
      right: 8,
      bottom: -8,
      backgroundColor: theme.colors.white,
    },
    label: {
      color: hasValidationErrors
        ? theme.colors.errorRed
        : isFocused
        ? theme.colors.positivepurple
        : theme.colors.softblack,
      alignSelf: 'stretch',
    },
    helper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    helperText: {
      color: theme.colors.greyAAA,
    },
    validationErrorText: {
      color: theme.colors.errorRed,
    },
    iconWrapper: {
      width: 22,
      height: 22,
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
