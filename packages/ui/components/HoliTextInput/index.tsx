import React, { useEffect, useState } from 'react'
import { TextInput, View } from 'react-native'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'
import { getHoliTextInputStyles as getStyles } from '@holi/ui/components/HoliTextInput/HoliTextInput.styles'
import { KeyboardType } from '@holi/ui/components/HoliTextInput/HoliTextInput.types'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliTextInputProps = {
  label?: string
  placeholder?: string
  helperText?: string
  isErrored?: boolean
  noLabel?: boolean
  isFullWidth?: boolean
  minNumberOfLines?: number
  maxNumberOfLines?: number
  onChange?: (value: string) => void
  keyboardType?: keyof typeof KeyboardType
  [x: string]: any
}

const HoliTextInput = ({
  label = 'Label',
  helperText = 'Helper Text',
  placeholder = 'Placeholder',
  noLabel = false,
  isFullWidth = false,
  minNumberOfLines = 1,
  maxNumberOfLines = 3,
  onChange,
  keyboardType = KeyboardType.default,
  ...props
}: HoliTextInputProps) => {
  const [isFocused, setFocused] = useState<boolean>(false)
  const [isHovered, setHovered] = useState<boolean>(false)
  const isHover = useHover
  const [isErrored, setErrored] = useState<boolean>(!!props?.isErrored ?? false)
  const [textAreaHeight, setTextAreaHeight] = useState<number | null>(null)
  useEffect(() => {
    setErrored(!!props?.isErrored ?? false)
  }, [props?.isErrored])

  const { theme } = useTheme()
  const styles = getStyles(theme, isErrored, isFocused, isFullWidth, isHovered)

  return (
    <>
      {!noLabel && (
        <View>
          <HoliText type={HoliTextType.caption} styles={styles.label}>
            {label}
          </HoliText>
        </View>
      )}
      <TextInput
        style={[styles.input]}
        multiline={minNumberOfLines > 1}
        numberOfLines={maxNumberOfLines >= minNumberOfLines ? maxNumberOfLines : minNumberOfLines}
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
          onChange && onChange(event.nativeEvent.text)
        }}
        onContentSizeChange={(event) => {
          console.log(event.nativeEvent.contentSize)
        }}
        keyboardType={KeyboardType[keyboardType]}
      />
      <View>
        <HoliText type={HoliTextType.label} styles={styles.helperText}>
          {helperText}
        </HoliText>
      </View>
    </>
  )
}

export default HoliTextInput
