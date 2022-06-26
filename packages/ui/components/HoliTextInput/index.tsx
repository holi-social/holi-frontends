import React, { Fragment, useEffect, useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'
import {
  getHoliTextInputStyles as getStyles,
  inputLineHeight,
} from '@holi/ui/components/HoliTextInput/HoliTextInput.styles'
import { KeyboardType } from '@holi/ui/components/HoliTextInput/HoliTextInput.types'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliTextInputProps = {
  label?: string
  value?: string
  placeholder?: string
  helperText?: string
  isDisabled?: boolean
  isErrored?: boolean
  noLabel?: boolean
  minNumberOfLines?: number
  maxNumberOfLines?: number
  onChange?: (value: string) => void
  keyboardType?: keyof typeof KeyboardType
  // eslint-disable-next-line
  [x: string]: any
}

const minMaxNumberOfLines = 3

const HoliTextInput = ({
  label = '',
  helperText = '',
  placeholder = '',
  noLabel = false,
  minNumberOfLines = 1,
  maxNumberOfLines = minMaxNumberOfLines,
  onChange,
  keyboardType = KeyboardType.default,
  ...props
}: HoliTextInputProps) => {
  const [inputValue, setInputValue] = useState(props?.value || '')
  const [isHovered, setHovered] = useState<boolean>(false)
  const [isFocused, setFocused] = useState<boolean>(false)
  const [isErrored, setErrored] = useState<boolean>(!!props?.isErrored ?? false)
  const [numberOfLines, setNumberOfLines] = useState<number>(
    Math.max(minNumberOfLines, Math.min(minMaxNumberOfLines, maxNumberOfLines))
  )
  const growTextInput = (contentSizeHeight: number) => {
    if (maxNumberOfLines > numberOfLines) {
      const linesCount = Math.round((contentSizeHeight - inputLineHeight * minMaxNumberOfLines) / inputLineHeight)
      setNumberOfLines(Math.max(minMaxNumberOfLines, minMaxNumberOfLines + linesCount))
    }
  }

  useEffect(() => {
    setErrored(!!props?.isErrored ?? isErrored)
  }, [props?.isErrored])
  useEffect(() => {
    setInputValue(props?.value || inputValue)
  }, [props?.value])

  const { theme } = useTheme()
  const styles = getStyles({ theme, isErrored, isFocused, isHovered, isDisabled: !!props?.isDisabled })

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
          multiline={minNumberOfLines > 1}
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
          keyboardType={KeyboardType[keyboardType]}
          disabled={props?.isDisabled}
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
