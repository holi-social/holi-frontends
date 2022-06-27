import React, { Fragment, useEffect, useState } from 'react'
import { AccessibilityProps, KeyboardType, Pressable, Text, TextInput, View } from 'react-native'

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
  isDisabled?: boolean
  isErrored?: boolean
  noLabel?: boolean
  noOfLines?: number
  maxNoOfLines?: number
  noOfCharacters?: number
  onChange?: (value: string) => void
  keyboardType?: KeyboardType
  isInline?: boolean
  // eslint-disable-next-line
  [x: string]: any
}

const HoliTextInput = ({
  label = '',
  placeholder = '',
  helperText = '',
  isDisabled = false,
  noLabel = false,
  noOfLines = 1,
  maxNoOfLines = 10,
  noOfCharacters = 5000,
  onChange,
  keyboardType = 'default',
  isInline = true,
  ...props
}: HoliTextInputProps) => {
  const [inputValue, setInputValue] = useState(props?.value || '')
  const [isHovered, setHovered] = useState<boolean>(false)
  const [isFocused, setFocused] = useState<boolean>(false)
  const [isErrored, setErrored] = useState<boolean>(!!props?.isErrored ?? false)

  const maxNoOfLinesCap = 10
  const [numberOfLines, setNumberOfLines] = useState<number>(
    Math.max(noOfLines, Math.min(maxNoOfLinesCap, maxNoOfLines))
  )

  const growTextInput = (contentSizeHeight: number) => {
    if (maxNoOfLines > numberOfLines) {
      const linesCount = Math.round((contentSizeHeight - inputLineHeight * maxNoOfLinesCap) / inputLineHeight)
      setNumberOfLines(Math.max(maxNoOfLinesCap, maxNoOfLinesCap + linesCount))
    }
  }

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
  const styles = getStyles({ theme, isErrored, isFocused, isHovered, isDisabled: isDisabled, isInline: isInline })

  return (
    <Pressable
      onHoverIn={() => {
        setHovered(true)
      }}
      onHoverOut={() => {
        setHovered(false)
      }}
      style={styles.pressable}
    >
      {!noLabel && (
        <HoliText type={HoliTextType.caption} styles={styles.label}>
          {label}
        </HoliText>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          value={inputValue}
          style={[styles.input]}
          multiline={noOfLines > 1}
          numberOfLines={numberOfLines}
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
            growTextInput(event.nativeEvent.contentSize.height)
          }}
          keyboardType={keyboardType}
          maxLength={noOfCharacters}
          disabled={isDisabled}
          {...accessibilityProps}
        />
        {isErrored && <ErrorIcon />}
      </View>
      <HoliText type={HoliTextType.label} styles={styles.helperText}>
        {helperText}
      </HoliText>
    </Pressable>
  )
}

const ErrorIcon = () => {
  const { theme } = useTheme()
  const styles = getStyles({ theme })
  return (
    <View style={styles.errorIconWrapper}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorText}>!</Text>
      </View>
    </View>
  )
}

export default HoliTextInput
