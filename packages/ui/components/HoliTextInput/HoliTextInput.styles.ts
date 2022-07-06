import { Platform, StyleSheet } from 'react-native'
import tinycolor from 'tinycolor2'

import { HoliTheme } from '@holi/ui/styles/theme'

export const inputLineHeight = 16 * 1.4

export const getHoliTextInputStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
    },
    wrapperContainer: {
      minWidth: 190,
    },
    // @ts-ignore
    pressable: {
      ...Platform.select({
        web: {
          cursor: 'default',
        },
      }),
    },
    inputWrapper: {
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: tinycolor(theme.colors.softblack).lighten(80).toString(),
      borderRadius: 4,
      paddingLeft: 10,
      paddingVertical: 15,
      backgroundColor: theme.colors.white,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.positivepurple,
    },
    inputWrapperDisabled: {
      borderColor: tinycolor(theme.colors.softblack).lighten(80).toString(),
      backgroundColor: theme.colors.lightGrey,
    },
    inputWrapperHasValidationErrors: {
      borderColor: theme.colors.errorRed,
    },
    inputWrapperHovered: {
      borderColor: theme.colors.greyAA,
    },
    input: {
      flex: 1,
      fontSize: 16,
      lineHeight: inputLineHeight,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: theme.colors.softblack,
      overflow: 'scroll',
      marginRight: 10,
      ...Platform.select({
        web: {
          overflowX: 'hidden',
          caretColor: theme.colors.positivepurple,
        },
      }),
    },
    inline: {
      ...Platform.select({
        web: {
          alignSelf: 'flex-start',
          width: 'auto',
        },
      }),
      maxWidth: '100%',
    },
    block: {
      alignSelf: 'stretch',
      width: '100%',
    },
    inputCharsTextWrapper: {
      backgroundColor: tinycolor(theme.colors.softblack).lighten(80).toString(),
      borderRadius: 8,
      position: 'absolute',
      paddingHorizontal: 8,
      right: 8,
      bottom: -8,
    },
    inputCharsTextWrapperFocused: {
      backgroundColor: theme.colors.positivepurple,
    },
    inputCharsTextWrapperDisabled: {
      backgroundColor: theme.colors.softblackSolidTransparent,
    },
    inputCharsTextWrapperHasValidationErrors: {
      backgroundColor: theme.colors.errorRed,
    },
    inputCharsTextWrapperHovered: {
      backgroundColor: theme.colors.greyAA,
    },
    inputCharsText: {
      color: theme.colors.white,
    },
    labelWrapper: {
      marginBottom: 6,
    },
    label: {
      color: theme.colors.softblack,
    },
    labelFocused: {
      color: theme.colors.positivepurple,
    },
    labelHasValidationErrors: {
      color: theme.colors.errorRed,
    },
    helperTextWrapper: {
      marginTop: 6,
    },
    helperText: {
      color: theme.colors.greyAAA,
    },
    validationErrorText: {
      color: theme.colors.errorRed,
    },
    trailingIconWrapper: {
      width: 22,
      height: 22,
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginRight: 8,
    },
    trailingIconWrapperHasValidationErrors: {
      width: 16,
    },
  })
