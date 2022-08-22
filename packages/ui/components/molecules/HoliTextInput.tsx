import React, { memo, useEffect, useState } from 'react'
import {
  AccessibilityProps,
  KeyboardTypeOptions,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputIOSProps,
  TextInputProps,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import tinycolor from 'tinycolor2'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliTextInputProps = {
  label?: string
  value?: string
  placeholder?: string
  helperText?: string
  validationErrorText?: string
  disabled?: boolean
  noOfVisibleLines?: number
  maxNoOfVisibleLines?: number
  maxNoOfCharacters?: number
  onChange?: (value: string) => void
  type?: 'text' | 'email' | 'number' | 'password' // Force limited input types
  inline?: boolean
  trailingIcon?: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  /** TextInputProps to extend input e.g with'returnKeytype' or 'autofocus' */
  inputProps?: TextInputProps
  testID?: string
  // eslint-disable-next-line
  [x: string]: any
}

const HoliTextInput = ({
  noOfVisibleLines = 1,
  maxNoOfVisibleLines = 1,
  maxNoOfCharacters = 5000,
  inline = false,
  style = {},
  type,
  value,
  ...props
}: HoliTextInputProps) => {
  const dimensions = useWindowDimensions()
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

  const [isFocused, setFocused] = useState<boolean>(false)
  const hasValidationErrors = !!props?.validationErrorText

  const [numberOfLines, setNumberOfLines] = useState<number>(
    clamp(noOfVisibleLines, noOfVisibleLines, maxNoOfVisibleLines)
  )

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: true,
    accessibilityLabel: `${props?.label}`,
    accessibilityAutoComplete: 'inline',
  }

  useEffect(() => {
    setNumberOfLines(clamp(noOfVisibleLines, noOfVisibleLines, maxNoOfVisibleLines))
  }, [noOfVisibleLines, maxNoOfVisibleLines])

  const { theme } = useTheme()
  const styles = getStyles(theme)

  const keyboardType: KeyboardTypeOptions = (() => {
    if (type === 'email') return 'email-address'
    if (type === 'number') return 'numeric'
    return 'default'
  })()

  const textContentType: TextInputIOSProps['textContentType'] = (() => {
    const iOS12Plus = Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 12
    if (type === 'password') return iOS12Plus ? 'newPassword' : 'password'
    if (type === 'email') return Platform.OS === 'ios' ? 'username' : 'emailAddress'
  })()

  const autocomplete: TextInputProps['autoComplete'] = (() => {
    if (type === 'password') return Platform.OS === 'android' ? 'password' : 'current-password'
    if (type === 'email') return 'email'
    return 'off'
  })()

  return (
    <View style={[styles.wrapper, inline ? styles.inline : styles.block, style]}>
      <View style={[styles.wrapperContainer, { maxWidth: dimensions.width }, inline ? styles.inline : styles.block]}>
        {!!props?.label && (
          <View style={[styles.labelWrapper, inline ? styles.inline : styles.block]}>
            <HoliText
              size="small"
              bold
              style={[
                styles.label,
                isFocused ? styles.labelFocused : {},
                hasValidationErrors ? styles.labelHasValidationErrors : {},
              ]}
            >
              {props?.label}
            </HoliText>
          </View>
        )}
        <Pressable focusable={false} style={[styles.pressable]}>
          {({ hovered }) => (
            <View
              style={[
                styles.inputWrapper,
                inline ? styles.inline : styles.block,
                hovered && styles.inputWrapperHovered,
                isFocused && styles.inputWrapperFocused,
                props?.disabled && styles.inputWrapperDisabled,
                hasValidationErrors && styles.inputWrapperHasValidationErrors,
              ]}
            >
              <TextInput
                value={value}
                style={[
                  styles.input,
                  inline ? styles.inline : styles.block,
                  { height: numberOfLines * inputLineHeight },
                ]}
                numberOfLines={noOfVisibleLines}
                multiline={maxNoOfVisibleLines > 1}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={props?.placeholder}
                placeholderTextColor={colors.softblackTransparent}
                onChange={(event) => {
                  let text = event.nativeEvent.text
                  // type doesn't work with RN 'numeric' on web
                  if (type === 'number') text = text.replace(/[^0-9]/g, '')
                  props.onChange?.(text)
                }}
                onContentSizeChange={(event) => {
                  const contentSizeHeight = event.nativeEvent.contentSize.height
                  const calcNumberOfLines = Math.round(contentSizeHeight / inputLineHeight)
                  setNumberOfLines(clamp(calcNumberOfLines, noOfVisibleLines, maxNoOfVisibleLines))
                }}
                keyboardType={keyboardType}
                textContentType={textContentType}
                maxLength={maxNoOfCharacters}
                editable={!props?.disabled}
                blurOnSubmit={Platform.OS !== 'web'}
                secureTextEntry={type === 'password'}
                autoComplete={autocomplete}
                autoCapitalize="none"
                autoCorrect={false}
                {...accessibilityProps}
                {...props?.inputProps}
                testID={`${props?.testID || 'holi-text'}-input`}
              />
              {(hasValidationErrors || props?.trailingIcon) && (
                <View
                  style={[
                    styles.trailingIconWrapper,
                    hasValidationErrors && styles.trailingIconWrapperHasValidationErrors,
                  ]}
                >
                  {props?.trailingIcon && !hasValidationErrors && (
                    <HoliIcon
                      icon={props?.trailingIcon}
                      size={22}
                      color={
                        isFocused
                          ? colors.positivepurple
                          : hovered
                          ? colors.greyAA
                          : tinycolor(colors.softblack).lighten(80).toString()
                      }
                    />
                  )}
                  {hasValidationErrors && <HoliIcon icon="error-warning" size={16} filled color={colors.errorRed} />}
                </View>
              )}
              {(value?.length ?? 0) > maxNoOfCharacters * 0.8 && (
                <View
                  style={[
                    styles.inputCharsTextWrapper,
                    hovered && styles.inputCharsTextWrapperHovered,
                    isFocused && styles.inputCharsTextWrapperFocused,
                    props?.disabled && styles.inputCharsTextWrapperDisabled,
                    hasValidationErrors && styles.inputCharsTextWrapperHasValidationErrors,
                  ]}
                >
                  <HoliText
                    size="extrasmall"
                    style={styles.inputCharsText}
                  >{`${value?.length}/${maxNoOfCharacters}`}</HoliText>
                </View>
              )}
            </View>
          )}
        </Pressable>
        {(props?.validationErrorText || props?.helperText) && (
          <View style={[styles.helperTextWrapper, inline ? styles.inline : styles.block]}>
            <HoliText
              size="extrasmall"
              style={[styles.helperText, hasValidationErrors ? styles.validationErrorText : {}]}
              testID={`${props?.testID || 'holi-text'}-input${hasValidationErrors && '-error'}-message`}
            >
              {props?.validationErrorText || props?.helperText}
            </HoliText>
          </View>
        )}
      </View>
    </View>
  )
}

export default memo(HoliTextInput)

const inputLineHeight = 16 * 1.4

const getStyles = (theme: HoliTheme) =>
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
      borderColor: tinycolor(colors.softblack).lighten(80).toString(),
      borderRadius: 4,
      paddingLeft: 10,
      paddingVertical: 15,
      backgroundColor: colors.white,
    },
    inputWrapperFocused: {
      borderColor: colors.positivepurple,
    },
    inputWrapperDisabled: {
      borderColor: tinycolor(colors.softblack).lighten(80).toString(),
      backgroundColor: colors.lightGrey,
    },
    inputWrapperHasValidationErrors: {
      borderColor: colors.errorRed,
    },
    inputWrapperHovered: {
      borderColor: colors.greyAA,
    },
    input: {
      flex: 1,
      fontSize: 16,
      lineHeight: inputLineHeight,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: colors.softblack,
      overflow: 'scroll',
      marginRight: 10,
      ...Platform.select({
        web: {
          overflowX: 'hidden',
          caretColor: colors.positivepurple,
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
      backgroundColor: tinycolor(colors.softblack).lighten(80).toString(),
      borderRadius: 8,
      position: 'absolute',
      paddingHorizontal: 8,
      right: 8,
      bottom: -8,
    },
    inputCharsTextWrapperFocused: {
      backgroundColor: colors.positivepurple,
    },
    inputCharsTextWrapperDisabled: {
      backgroundColor: colors.softblackTransparent,
    },
    inputCharsTextWrapperHasValidationErrors: {
      backgroundColor: colors.errorRed,
    },
    inputCharsTextWrapperHovered: {
      backgroundColor: colors.greyAA,
    },
    inputCharsText: {
      color: colors.white,
    },
    labelWrapper: {
      marginBottom: 6,
    },
    label: {
      color: colors.softblack,
    },
    labelFocused: {
      color: colors.positivepurple,
    },
    labelHasValidationErrors: {
      color: colors.errorRed,
    },
    helperTextWrapper: {
      marginTop: 6,
    },
    helperText: {
      color: colors.greyAAA,
    },
    validationErrorText: {
      color: colors.errorRed,
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
