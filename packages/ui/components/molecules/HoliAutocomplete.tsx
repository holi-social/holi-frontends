// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
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
  testID?: string
  inputProps?: TextInputProps
  id: string
  onSubmit?: (value: string) => void
  onSelect?: (value: Suggestion) => void // should probably handle the non selection case
  onClose?: (value?: Suggestion) => void
  suggestionsStyle?: StyleProp<ViewStyle>
}

const HoliAutocomplete = (
  {
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
    id, // think about encapsulating the selection mechanism from the ground up
    testID,
    onSubmit, // why do we need this?
    onSelect,
    onClose,
    suggestionsStyle = {},
  }: HoliAutocompleteProps,
  ref: React.ForwardedRef<View>
) => {
  const [searchText, setSearchText] = useState(value || '')
  const [isOpened, setIsOpened] = useState(false)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

  const onChangeText = useCallback(
    async (text: string) => {
      setSearchText(text)
      return onChange && onChange(text)
    },
    [onChange]
  )

  // Update search text if value changes from outside (e.g. cleared)
  useEffect(() => {
    setSearchText(value || '')
  }, [value])

  const handleItemSelection = useCallback(
    (item: Suggestion) => {
      onSelect && onSelect(item)
      onClose && onClose(item)
      onChangeText(item.label)
      setIsOpened(false)
      Keyboard.dismiss()
    },
    [onChangeText, onSelect, onClose]
  )

  const clearFocusAndClose = useCallback(
    (focusId: string | null) => {
      if (isOpened) {
        // using setTimeout to make sure no other item was selected in the mean time
        requestAnimationFrame(() => {
          setFocusedItem((id) => {
            if (id === focusId) {
              setIsOpened(false)
              onClose && onClose()
              return null
            }
            return id
          })
        })
      }
    },
    [isOpened, onClose]
  )

  const setFocusAndOpen = useCallback((focusId: string) => {
    setIsOpened(true)
    setFocusedItem(focusId)
  }, [])

  const onTextinputBlur = useCallback(() => {
    clearFocusAndClose(focusedItem)
  }, [clearFocusAndClose, focusedItem])

  const onSubmitEditing = useCallback(() => {
    onSubmit && onSubmit(searchText || '')
    setIsOpened(false)
  }, [onSubmit, searchText])

  const renderItem = useCallback(
    (item: Suggestion, index: number) => {
      const isLast = index === suggestions.length - 1
      return (
        <HoliButton
          inline
          transparent
          key={item.id}
          label={item.label}
          accessibilityRole="menuitem"
          style={[styles.listItem, isLast && styles.listItemLast]}
          onFocus={() => setFocusAndOpen('suggestion-' + item.id)}
          onBlur={onTextinputBlur}
          onPress={() => handleItemSelection(item)}
          testID={testID && `${testID}-item-${item.id}`}
        >
          <HoliText selectable={false} numberOfLines={2}>
            {item.label}
          </HoliText>
        </HoliButton>
      )
    },
    [testID, suggestions, handleItemSelection, setFocusAndOpen, onTextinputBlur]
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
        validationErrorText={!isOpened && validationErrorText} // hide it when opening the suggestions
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
        onBlur={onTextinputBlur}
        onFocus={() => setFocusAndOpen('input')}
        testID={testID}
        ref={ref}
      />
      <View nativeID={`${id}-suggestions`} accessibilityRole="menu" style={suggestionsStyle}>
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          isOpened ? suggestions.map(renderItem) : <></>
        }
      </View>
    </View>
  )
}

export default memo(React.forwardRef(HoliAutocomplete))

const styles = StyleSheet.create({
  textInputOpened: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textInputFocused: {
    borderColor: colors.brandColorB30,
  },
  textInputLabelFocused: {
    color: colors.brandColorB30,
  },
  listItem: {
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'center',
    display: 'flex',
    borderColor: colors.brandColorB30,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  listItemLast: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 2,
  },
})
