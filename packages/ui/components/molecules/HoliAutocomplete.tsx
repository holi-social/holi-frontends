// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import debounce from 'lodash.debounce'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { StyleProp, TextInputProps, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

export type HoliAutocompleteProps = {
  inputLabel?: string
  accessibilityLabel: string
  value?: string
  placeholder?: string
  helperText?: string
  validationErrorText?: string
  onChange?: (value: string) => void
  trailingIcon?: string
  loading?: boolean
  style?: StyleProp<ViewStyle>
  suggestions: HoliSelectOption[]
  debounce: number
  testID?: string
  inputProps?: TextInputProps
  id: string
  onSubmit?: (value: string) => void
  noResultsText?: string
}

const HoliAutocomplete = ({
  style = {},
  accessibilityLabel,
  value,
  inputLabel,
  placeholder,
  helperText,
  validationErrorText,
  onChange,
  loading,
  inputProps,
  trailingIcon,
  suggestions = [],
  debounce: debounceValue,
  id,
  testID,
  onSubmit,
  noResultsText,
}: HoliAutocompleteProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((text: string) => {
      return onChange && onChange(text)
    }, debounceValue ?? 0),
    [debounceValue, onChange]
  )
  // Stop the invocation of the debounced function after unmounting
  useEffect(() => {
    return () => debouncedOnChange.cancel()
  }, [debouncedOnChange])

  const onSelectOption = useCallback((item) => debouncedOnChange(item.title), [debouncedOnChange])

  const trailingComponent = useMemo(() => {
    const icon = loading ? 'loader-4' : trailingIcon || 'search'
    return <HoliIcon spinning={loading} icon={icon} size={22} />
  }, [trailingIcon, loading])

  return (
    <HoliSelect
      style={style}
      inputLabel={inputLabel}
      accessibilityLabel={accessibilityLabel}
      placeholder={placeholder}
      validationErrorText={validationErrorText}
      helperText={helperText}
      initialSearchText={value}
      options={suggestions}
      trailingIcon={trailingComponent}
      inputProps={inputProps}
      testID={testID}
      id={id}
      onChangeText={debouncedOnChange}
      onSelectOption={onSelectOption}
      onSubmit={onSubmit}
      filterOptions={false}
      selectionAsPlaceholder={false}
      noResultsText={noResultsText}
      hideListWithoutOptions={!value || loading}
    />
  )
}

export default memo(HoliAutocomplete)
