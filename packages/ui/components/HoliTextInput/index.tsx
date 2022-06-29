import React, { useEffect, useRef, useState } from 'react'
import {
  AccessibilityProps,
  KeyboardType,
  Pressable,
  ReturnKeyType,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native'

import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'
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
  isErrored?: boolean
  noLabel?: boolean
  /** Number of lines/rows to be displayed on initial render. */
  noOfLines?: number
  maxNoOfLines?: number
  noOfCharacters?: number
  onChange?: (value: string) => void
  keyboardType?: KeyboardType
  returnKeyType?: ReturnKeyType
  isInline?: boolean
  /** TextInputProps to extend input */
  inputProps?: TextInputProps
  trailingIcon?: string
  // eslint-disable-next-line
  [x: string]: any
}

const HoliTextInput = ({
  label = '',
  placeholder = '',
  helperText = '',
  validationErrorText = '',
  isDisabled = false,
  noLabel = false,
  noOfLines = 1,
  maxNoOfLines = 3,
  noOfCharacters = 5000,
  onChange,
  keyboardType = 'default',
  returnKeyType = 'done',
  isInline = true,
  inputProps,
  trailingIcon,
  ...props
}: HoliTextInputProps) => {
  const [inputValue, setInputValue] = useState(props?.value || '')
  const [isHovered, setHovered] = useState<boolean>(false)
  const [isFocused, setFocused] = useState<boolean>(false)
  const [isErrored, setErrored] = useState<boolean>(!!props?.isErrored ?? false)

  const inputRef = useRef(null)
  const [inputHeight, setInputHeight] = useState<number>(noOfLines * inputLineHeight)

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityLabel: `${label}`,
  }

  useEffect(() => {
    setErrored(!!props?.isErrored ?? isErrored)
  }, [props?.isErrored])
  useEffect(() => {
    setInputValue(props?.value || inputValue)
  }, [props?.value])

  const { theme } = useTheme()
  const styles = getStyles({ theme, hasValidationErrors: isErrored, isFocused, isHovered, isDisabled, isInline })

  return (
    <Pressable onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)} style={styles.pressable}>
      {!noLabel && (
        <HoliText type={HoliTextType.caption} styles={styles.label}>
          {label}
        </HoliText>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          value={inputValue}
          style={[styles.input, { height: inputHeight }]}
          multiline={noOfLines > 1}
          onFocus={() => {
            setFocused(true)
          }}
          onBlur={() => {
            setFocused(false)
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.softblackTransparent}
          onChange={(event) => {
            setErrored(false)
            setInputValue(event.nativeEvent.text)
            onChange && onChange(event.nativeEvent.text)
          }}
          onContentSizeChange={(event) => {
            const contentSizeHeight = event.nativeEvent.contentSize.height
            const maxHeightCap = Math.max(noOfLines, maxNoOfLines) * inputLineHeight
            contentSizeHeight <= maxHeightCap && setInputHeight(contentSizeHeight)
          }}
          keyboardType={keyboardType}
          maxLength={noOfCharacters}
          editable={!isDisabled}
          returnKeyType={returnKeyType}
          {...accessibilityProps}
          {...inputProps}
        />
        {(isErrored || trailingIcon) && (
          <View style={styles.iconWrapper}>
            {trailingIcon && !isErrored && <HoliIcon icon={trailingIcon} size={22} color={theme.colors.softblack} />}
            {isErrored && (
              <View style={styles.errorIcon}>
                <Text style={styles.errorText}>!</Text>
              </View>
            )}
          </View>
        )}
        {inputValue.length > noOfCharacters * 0.8 && (
          <HoliText type={HoliTextType.label} styles={styles.inputCharsText}>
            {`${inputValue.length}/${noOfCharacters}`}
          </HoliText>
        )}
      </View>
      <View style={styles.helper}>
        {isErrored && validationErrorText != '' && (
          <HoliText type={HoliTextType.label} styles={styles.validationErrorText}>
            {validationErrorText}
          </HoliText>
        )}
        {!isErrored && helperText != '' && (
          <HoliText type={HoliTextType.label} styles={styles.helperText}>
            {helperText}
          </HoliText>
        )}
      </View>
    </Pressable>
  )
}

export default HoliTextInput
