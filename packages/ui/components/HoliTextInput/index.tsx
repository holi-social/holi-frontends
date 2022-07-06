import React, { memo, useEffect, useState } from 'react'
import {
  AccessibilityProps,
  KeyboardType,
  Pressable,
  ReturnKeyType,
  TextInput,
  TextInputProps,
  View,
  useWindowDimensions,
  Platform,
} from 'react-native'

import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliText from '@holi/ui/components/HoliText'
import {
  getHoliTextInputStyles as getStyles,
  inputLineHeight,
} from '@holi/ui/components/HoliTextInput/HoliTextInput.styles'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliTextInputProps = {
  label?: string
  value?: string
  placeholder?: string
  helperText?: string
  validationErrorText?: string
  isDisabled?: boolean
  hasValidationErrors?: boolean
  noLabel?: boolean
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
                  { height: numberOfLines * inputLineHeight },
                ]}
                multiline={noOfLines > 1}
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
