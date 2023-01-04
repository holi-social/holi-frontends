// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import debounce from 'lodash.debounce'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Keyboard, StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

export type Suggestion = {
  id: string
  label: string
}

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
  suggestions: Suggestion[]
  debounce: number
  testID?: string
  inputProps?: TextInputProps
  id: string
  onSubmit?: (value: string) => void
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
    async (text: string) => {
      setSearchText(text)
      return debouncedOnChange(text)
    },
    [setSearchText, debouncedOnChange]
  )

  // Update search text if value changes from outside (e.g. cleared)
  useEffect(() => {
    setSearchText(value || '')
  }, [value])

  const handleItemSelection = useCallback(
    (item) => {
      onChangeText(item.label)
      setIsOpened(false)
      Keyboard.dismiss()
    },
    [setIsOpened, onChangeText]
  )

  const clearFocusAndClose = useCallback(
    (focusId) => {
      // using setTimeout to make sure no other item was selected in the mean time
      setTimeout(() => {
        setFocusedItem((id) => {
          if (id === focusId) {
            setIsOpened(false)
            return null
          }
          return id
        })
      }, 0)
    },
    [setFocusedItem, setIsOpened]
  )

  const setFocusAndOpen = useCallback(
    (focusId) => {
      setIsOpened(true)
      setFocusedItem(focusId)
    },
    [setFocusedItem, setIsOpened]
  )

  const onBlur = useCallback(() => {
    clearFocusAndClose(focusedItem)
  }, [clearFocusAndClose, focusedItem])

  const onSubmitEditing = useCallback(() => {
    onSubmit && onSubmit(searchText || '')
    setIsOpened(false)
  }, [onSubmit, setIsOpened, searchText])

  const renderItem = useCallback(
    (item, index) => {
      const isLast = index === suggestions.length - 1
      return (
        <HoliButton
          inline
          transparent
          key={item.id}
          label={item.label}
          accessibilityRole="menuitem"
          onBlur={onBlur}
          style={[styles.listItem, isLast && styles.listItemLast]}
          onFocus={() => setFocusAndOpen('suggestion-' + item.id)}
          onPress={() => handleItemSelection(item)}
          testID={testID && `${testID}-item-${item.id}`}
        >
          <HoliText selectable={false} numberOfLines={2}>
            {item.label}
          </HoliText>
        </HoliButton>
      )
    },
    [testID, suggestions, handleItemSelection, setFocusAndOpen, onBlur]
  )

  const trailingComponent = useMemo(() => {
    const icon = loading ? 'loader-4' : trailingIcon || 'search'
    return <HoliIcon spinning={loading} icon={icon} size={22} />
  }, [trailingIcon, loading])

  return (
    <View style={style}>
      <HoliTextInput
        inputLabel={inputLabel}
        value={searchText}
        placeholder={placeholder}
        validationErrorText={validationErrorText}
        helperText={isOpened && suggestions.length ? undefined : helperText}
        accessibilityLabel={accessibilityLabel}
        accessibilityAutoComplete="list"
        accessibilityControls={`${id}-suggestions`}
        accessibilityRole="combobox"
        accessibilityExpanded={isOpened}
        accessibilityHasPopup="menu"
        trailingComponent={trailingComponent}
        inputProps={{ ...inputProps, onSubmitEditing }}
        inputStyle={[
          isOpened && suggestions.length ? styles.textInputOpened : {},
          focusedItem ? styles.textInputFocused : {},
        ]}
        labelStyle={[focusedItem ? styles.textInputLabelFocused : {}]}
        onChange={onChangeText}
        onBlur={onBlur}
        onFocus={() => setFocusAndOpen('input')}
        testID={testID}
      />
      <View nativeID={`${id}-suggestions`} accessibilityRole="menu">
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          isOpened ? suggestions.map(renderItem) : <></>
        }
      </View>
    </View>
  )
}

export default memo(HoliAutocomplete)

const styles = StyleSheet.create({
  textInputOpened: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textInputFocused: {
    borderColor: colors.borderColorSecondary,
  },
  textInputLabelFocused: {
    color: colors.secondaryColor,
  },
  listItem: {
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'center',
    display: 'flex',
    borderColor: colors.borderColorSecondary,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  listItemLast: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 2,
  },
})
