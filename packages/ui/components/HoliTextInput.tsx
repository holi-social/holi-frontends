import React, { memo, useEffect, useState } from 'react'
import {
  AccessibilityProps,
  KeyboardType,
  Platform,
  Pressable,
  ReturnKeyType,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
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
  isDisabled?: boolean
  hasValidationErrors?: boolean
  noLabel?: boolean
  multiline?: boolean
  /** Number of lines/rows to be displayed on initial render. Min of noOfLines/maxNoOfLines */
  noOfLines?: number
  maxNoOfLines?: number
  maxNoOfCharacters?: number
  onChange?: (value: string) => void
  keyboardType?: KeyboardType
  returnKeyType?: ReturnKeyType
  inline?: boolean
  /** TextInputProps to extend input */
  inputProps?: TextInputProps
  trailingIcon?: string
  secureTextEntry?:boolean
  // eslint-disable-next-line
  [x: string]: any
}

const HoliTextInput = ({
  noOfLines = 1,
  maxNoOfLines = 3,
  maxNoOfCharacters = 5000,
  inline = true,
  ...props
}: HoliTextInputProps) => {
  const dimensions = useWindowDimensions()
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

  const [inputValue, setInputValue] = useState(props?.value || '')
  const [isFocused, setFocused] = useState<boolean>(false)
  const [hasValidationErrors, setErrored] = useState<boolean>(!!props?.hasValidationErrors ?? false)

  const [numberOfLines, setNumberOfLines] = useState<number>(clamp(noOfLines, noOfLines, maxNoOfLines))

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityLabel: `${props?.label}`,
  }

  useEffect(() => {
    setErrored(!!props?.hasValidationErrors ?? hasValidationErrors)
  }, [props?.hasValidationErrors])
  useEffect(() => {
    setInputValue(props?.value || inputValue)
  }, [props?.value])
  useEffect(() => {
    setNumberOfLines(clamp(noOfLines, noOfLines, maxNoOfLines))
  }, [noOfLines, maxNoOfLines])

  const { theme } = useTheme()
  const styles = getStyles(theme)

  console.log('HoliTextInput', props)
  return (
    <View style={[styles.wrapper, inline ? styles.inline : styles.block]}>
      <View style={[styles.wrapperContainer, { maxWidth: dimensions.width }, inline ? styles.inline : styles.block]}>
        {!props?.noLabel && (
          <View style={[styles.labelWrapper, inline ? styles.inline : styles.block]}>
            <HoliText
              size="small"
              bold
              styles={[
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
                props?.isDisabled && styles.inputWrapperDisabled,
                hasValidationErrors && styles.inputWrapperHasValidationErrors,
              ]}
            >
              <TextInput
                value={inputValue}
                style={[
                  styles.input,
                  inline ? styles.inline : styles.block,
                  { height: numberOfLines * inputLineHeight + (props?.multiline ? 1 : 0) },
                ]}
                multiline={!!props?.multiline}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={props?.placeholder}
                placeholderTextColor={theme.colors.softblackTransparent}
                onChange={(event) => {
                  setErrored(false)
                  setInputValue(event.nativeEvent.text)
                  props?.onChange && props?.onChange(event.nativeEvent.text)
                }}
                onContentSizeChange={(event) => {
                  const contentSizeHeight = event.nativeEvent.contentSize.height
                  const calcNumberOfLines = Math.round(contentSizeHeight / inputLineHeight)
                  setNumberOfLines(clamp(calcNumberOfLines, noOfLines, maxNoOfLines))
                }}
                keyboardType={props?.keyboardType}
                maxLength={maxNoOfCharacters}
                editable={!props?.isDisabled}
                returnKeyType={props?.returnKeyType}
                blurOnSubmit={Platform.OS !== 'web'}
                secureTextEntry={props?.secureTextEntry}
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
                    <HoliIcon icon={props?.trailingIcon} size={22} color={theme.colors.softblack} />
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
                    props?.isDisabled && styles.inputCharsTextWrapperDisabled,
                    hasValidationErrors && styles.inputCharsTextWrapperHasValidationErrors,
                  ]}
                >
                  <HoliText styles={styles.inputCharsText}>{`${inputValue.length}/${maxNoOfCharacters}`}</HoliText>
                </View>
              )}
            </View>
          )}
        </Pressable>
        <View style={[styles.helperTextWrapper, inline ? styles.inline : styles.block]}>
          <HoliText
            size="extrasmall"
            styles={[styles.helperText, hasValidationErrors ? styles.validationErrorText : {}]}
          >
            {hasValidationErrors ? props?.validationErrorText : props?.helperText}
          </HoliText>
        </View>
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
