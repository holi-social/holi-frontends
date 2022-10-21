// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import debounce from 'lodash.debounce'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AccessibilityProps, Keyboard, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

type SuggestionHighlight = {
  length: number
  offset: number
}

export type Suggestion = {
  id: string
  label: string
  highlights: SuggestionHighlight[]
}

export type HoliAutocompleteProps = {
  inputLabel?: string
  accessibilityLabel: string
  value?: string
  placeholder?: string
  helperText?: string
  validationErrorText?: string
  disabled?: boolean
  onChange?: (value: string) => void
  inline?: boolean
  trailingIcon?: string
  loading?: boolean
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  suggestions: Suggestion[]
  debounce: number
  testID?: string
  inputProps?: TextInputProps
}

const HoliAutocomplete = ({
  inline = false,
  style = {},
  accessibilityLabel,
  value,
  inputLabel,
  placeholder,
  helperText,
  validationErrorText,
  onChange,
  loading,
  suggestions = [],
  testID,
  inputProps,
  debounce: debounceValue,
  trailingIcon,
}: HoliAutocompleteProps) => {
  const [searchText, setSearchText] = useState(value || '')
  const [selectedItem, setSelectedItem] = useState<Suggestion | null>(null)
  const [isOpened, setIsOpened] = useState(false)

  // TODO(SF) simplify? is selectedItem actually needed?

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

  const onChangeText = useCallback(
    async (text) => {
      setSearchText(text)
      return debouncedOnChange(text)
    },
    [setSearchText, debouncedOnChange]
  )

  useEffect(() => {
    setSearchText(value || '')
  }, [value])

  /** Set initial value */
  useEffect(() => {
    if (selectedItem) {
      // nothing to set or already setted
      return
    }
    if (value && !suggestions.length) {
      onChangeText(value)
    } else {
      const listItem = suggestions.find((el) => el.id === value)

      if (listItem) {
        setSelectedItem(listItem)
      }
    }
  }, [suggestions, value, setSelectedItem, selectedItem, onChangeText])

  const handleItemSelection = useCallback(
    (item) => {
      onChangeText(item.label)
      setSelectedItem(item)
      setIsOpened(false)
    },
    [setSelectedItem, setIsOpened, onChangeText]
  )

  /** methods */
  const close = useCallback(() => {
    setIsOpened(false)
  }, [setIsOpened])

  const open = useCallback(async () => {
    setIsOpened(true)
  }, [setIsOpened])

  const renderItem = useCallback(
    (item, index) => {
      const isSelected = selectedItem?.id === item.id
      const isLast = index === suggestions.length - 1
      return (
        <HoliButton
          key={item.id}
          label={item.label}
          onPress={() => handleItemSelection(item)}
          inline
          transparent
          testID={testID && `${testID}-item-${item.id}`}
          style={[styles.listItem, isLast && styles.listItemLast]}
        >
          <HoliText numberOfLines={2}>{item.label}</HoliText>
        </HoliButton>
      )
    },
    [testID, suggestions, handleItemSelection, selectedItem]
  )

  // Keyboard.dismiss() // TODO(SF) use this somewhere?

  // TODO(SF) close list if no relevant element is focused anymore
  // const onBlur = useCallback(() => {
  //   if (closeOnBlur) {
  //     close()
  //   }
  // }, [closeOnBlur, close])

  const trailingComponent = useMemo(() => {
    const icon = loading ? 'loader-4' : trailingIcon || 'search'
    return <HoliIcon spinning={loading} icon={icon} size={22} />
  }, [trailingIcon, loading])

  return (
    <View style={[styles.container, style]}>
      <HoliTextInput
        inputLabel={inputLabel}
        accessibilityLabel={accessibilityLabel}
        value={searchText}
        placeholder={placeholder}
        helperText={helperText}
        validationErrorText={validationErrorText}
        onChange={onChangeText}
        inline={inline}
        trailingComponent={trailingComponent}
        testID={testID && `${testID}-input`}
        inputProps={inputProps}
        inputStyle={[styles.textInput, isOpened && suggestions.length && styles.textInputOpened]}
        onFocus={open}
        // onBlur={close}
      />
      {isOpened ? suggestions.map(renderItem) : <></>}
    </View>
  )
}

export default memo(HoliAutocomplete)

const styles = StyleSheet.create({
  container: {},
  textInput: {},
  textInputOpened: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  listItem: {
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'center',
    display: 'flex',
    borderColor: colors.positivepurple,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  listItemLast: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 2,
  },
})
