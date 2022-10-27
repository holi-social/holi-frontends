// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import debounce from 'lodash.debounce'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Keyboard, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'

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
  id: string
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
  id,
}: HoliAutocompleteProps) => {
  const [searchText, setSearchText] = useState(value || '')
  const [isOpened, setIsOpened] = useState(false)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

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

  // Get suggestions for initial value
  useEffect(() => {
    if (value && !suggestions.length) {
      onChangeText(value)
    }
  }, [suggestions, value, onChangeText])

  const handleItemSelection = useCallback(
    (item) => {
      onChangeText(item.label)
      setIsOpened(false)
      Keyboard.dismiss()
    },
    [setIsOpened, onChangeText]
  )

  const close = useCallback(() => {
    setIsOpened(false)
  }, [setIsOpened])

  const open = useCallback(async () => {
    setIsOpened(true)
  }, [setIsOpened])

  const clearFocusAndClose = useCallback(
    (focusId) => {
      // using setTimeout to make sure no other item was selected in the mean time
      setTimeout(() => {
        setFocusedItem((id) => {
          if (id === focusId) {
            close()
            return null
          }
          return id
        })
      }, 0)
    },
    [setFocusedItem, close]
  )

  const setFocusAndOpen = useCallback(
    (focusId) => {
      open()
      setFocusedItem(focusId)
    },
    [setFocusedItem, open]
  )

  const onBlur = useCallback(() => {
    clearFocusAndClose(focusedItem)
  }, [clearFocusAndClose, focusedItem])

  const renderItem = useCallback(
    (item, index) => {
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
          accessibilityRole="menuitem"
          id={`${id}-suggestion-${item.id}`}
          onFocus={() => setFocusAndOpen('suggestion' + item.id)}
          onBlur={onBlur}
        >
          <HoliText selectable={false} numberOfLines={2}>
            {item.label}
          </HoliText>
        </HoliButton>
      )
    },
    [testID, suggestions, handleItemSelection, id, setFocusAndOpen, onBlur]
  )

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
        inputProps={{ ...inputProps }}
        inputStyle={[
          styles.textInput,
          isOpened && suggestions.length ? styles.textInputOpened : {},
          focusedItem ? styles.textInputFocused : {},
        ]}
        labelStyle={[focusedItem ? styles.textInputLabelFocused : {}]}
        onFocus={() => setFocusAndOpen('input')}
        onBlur={onBlur}
        accessibilityAutoComplete="list"
        accessibilityControls={`${id}-suggestions`}
        accessibilityRole="combobox"
        accessibilityExpanded={isOpened}
        accessibilityHasPopup="menu"
      />
      <View nativeID={`${id}-suggestions`} accessibilityRole="menu">
        {isOpened ? suggestions.map(renderItem) : <></>}
      </View>
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
  textInputFocused: {
    borderColor: colors.positivepurple,
  },
  textInputLabelFocused: {
    color: colors.positivepurple,
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
