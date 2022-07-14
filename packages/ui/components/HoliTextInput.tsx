import React, { memo, useEffect, useState } from 'react'
import {
  AccessibilityProps,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import tinycolor from 'tinycolor2'

import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliTextInputProps = {
  label?: string
  value?: string
  placeholder?: string
  helperText?: string
  validationErrorText?: string
  disabled?: boolean
  /** Number of lines/rows to be displayed on initial render. Min of noOfLines/maxNoOfLines */
  noOfLines?: number
  maxNoOfLines?: number
  maxNoOfCharacters?: number
  onChange?: (value: string) => void
  type?: 'text' | 'email' | 'number' | 'password' // Force limited input types
  inline?: boolean
  trailingIcon?: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  /** TextInputProps to extend input e.g ('returnKeytype')*/
  inputProps?: TextInputProps
  // eslint-disable-next-line
  [x: string]: any
}

const HoliTextInput = ({
  noOfLines = 1,
  maxNoOfLines = 1,
  maxNoOfCharacters = 5000,
  inline = false,
  style = {},
  ...props
}: HoliTextInputProps) => {
  const dimensions = useWindowDimensions()
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

  const [inputValue, setInputValue] = useState(props?.value || '')
  const [isFocused, setFocused] = useState<boolean>(false)
  const hasValidationErrors = !!props?.validationErrorText

  const [numberOfLines, setNumberOfLines] = useState<number>(clamp(noOfLines, noOfLines, maxNoOfLines))

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityLabel: `${props?.label}`,
  }

  useEffect(() => {
    setNumberOfLines(clamp(noOfLines, noOfLines, maxNoOfLines))
  }, [noOfLines, maxNoOfLines])

  const { theme } = useTheme()
  const styles = getStyles(theme)

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
                value={inputValue}
                style={[
                  styles.input,
                  inline ? styles.inline : styles.block,
                  { height: numberOfLines * inputLineHeight },
                ]}
                multiline={maxNoOfLines > 1}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={props?.placeholder}
                placeholderTextColor={theme.colors.softblackTransparent}
                onChange={(event) => {
                  let text = event.nativeEvent.text
                  // type doesn't work with RN 'numeric' on web
                  if (props?.type === 'number') text = text.replace(/[^0-9]/g, '')
                  setInputValue(text)
                  props?.onChange && props?.onChange(text)
                }}
                onContentSizeChange={(event) => {
                  const contentSizeHeight = event.nativeEvent.contentSize.height
                  const calcNumberOfLines = Math.round(contentSizeHeight / inputLineHeight)
                  setNumberOfLines(clamp(calcNumberOfLines, noOfLines, maxNoOfLines))
                }}
                keyboardType={
                  props?.type === 'email' ? 'email-address' : props?.type === 'number' ? 'numeric' : 'default'
                }
                maxLength={maxNoOfCharacters}
                editable={!props?.disabled}
                blurOnSubmit={Platform.OS !== 'web'}
                secureTextEntry={props?.type === 'password'}
                {...accessibilityProps}
                {...props?.inputProps}
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
                          ? theme.colors.positivepurple
                          : hovered
                          ? theme.colors.greyAA
                          : tinycolor(theme.colors.softblack).lighten(80).toString()
                      }
                    />
                  )}
                  {hasValidationErrors && (
                    <HoliIcon icon={'error-warning'} size={16} filled color={theme.colors.errorRed} />
                  )}
                </View>
              )}
              {inputValue.length > maxNoOfCharacters * 0.8 && (
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
                  >{`${inputValue.length}/${maxNoOfCharacters}`}</HoliText>
                </View>
              )}
            </View>
          )}
        </Pressable>
        {(props?.validationErrorText || props?.helperText) && (
          <View style={[styles.helperTextWrapper, inline ? styles.inline : styles.block]}>
            <HoliText
              size="extrasmall"
              styles={[styles.helperText, hasValidationErrors ? styles.validationErrorText : {}]}
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
