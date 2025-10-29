import React, { useCallback } from 'react'

import HoliTextInput, { type HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'
import type { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import type { TextInputProps } from 'react-native'

export interface AuthFormInputFieldProps {
  label: string
  placeholder?: string
  value?: string
  onChange: (value?: string) => void
  validationErrorText?: string
  type: HoliTextInputProps['type']
  autoFocus?: boolean
  onSubmit: () => Promise<void>
}

export const AuthFormInputField = ({
  label,
  placeholder,
  value,
  onChange,
  validationErrorText,
  type,
  autoFocus,
  onSubmit,
}: AuthFormInputFieldProps) => {
  const onKeyPress = useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData | TextInputProps>) => {
    const nativeElement = event.nativeEvent as TextInputKeyPressEventData
    if (nativeElement.key === 'Enter') {
      const element = event.target as TextInputProps
      onChange(element.value)
      onSubmit()
    }
  }, [])

  // TODO(SF) only for login?
  const textContentType = type === 'password' ? 'password' : undefined

  return (
    <HoliTextInput
      aria-label={label}
      placeholder={placeholder}
      value={value}
      validationErrorText={validationErrorText}
      noOfVisibleLines={1}
      maxNoOfVisibleLines={1}
      maxNoOfCharacters={200}
      onChange={onChange}
      type={type}
      inputLabel={label}
      inputProps={{
        onKeyPress,
        autoFocus,
        textContentType,
      }}
    />
  )
}
