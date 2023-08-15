// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Keyboard, StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader, Search } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

export type Suggestion = {
  id: string
  label: string
}
interface AutocompleteItemProps {
  suggestion: Suggestion
  onFocus?: (suggestion: Suggestion) => void
  onBlur?: (suggestion: Suggestion) => void
  onPress?: (suggestion: Suggestion) => void
  isLast: boolean
  testID?: string
}
const HoliAutocompleteItem: React.VFC<AutocompleteItemProps> = ({
  suggestion,
  onBlur,
  onFocus,
  onPress,
  testID,
  isLast,
}) => {
  return (
    <HoliButton
      inline
      transparent
      label={suggestion.label}
      accessibilityRole="menuitem"
      style={[styles.listItem, isLast && styles.listItemLast]}
      testID={testID && `${testID}-item-${suggestion.id}`}
      onBlur={() => onBlur?.(suggestion)}
      onFocus={() => onFocus?.(suggestion)}
      onPress={() => onPress?.(suggestion)}
    >
      <HoliText selectable={false} numberOfLines={2}>
        {suggestion.label}
      </HoliText>
    </HoliButton>
  )
}

export type HoliAutocompleteProps = {
  inputLabel?: string
  accessibilityLabel: string
  value?: string
  placeholder?: string
  helperText?: string
  validationErrorText?: string
  onChange?: (value: string) => void
  trailingIcon?: HoliIconType
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

const HoliAutocomplete = React.forwardRef<View, HoliAutocompleteProps>(
  (
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
    },
    ref
  ) => {
    const [searchText, setSearchText] = useState(value || '')
    const [isOpened, setIsOpened] = useState(false)
    const [focusedItem, setFocusedItem] = useState<string | null>(null)

    const onChangeText = useCallback(
      async (text: string) => {
        setSearchText(text)
        return onChange?.(text)
      },
      [onChange]
    )

    // Update search text if value changes from outside (e.g. cleared)
    useEffect(() => {
      setSearchText(value || '')
    }, [value])

    const handleItemSelection = useCallback(
      (item: Suggestion) => {
        onSelect?.(item)
        onClose?.(item)
        onChangeText(item.label)
        setIsOpened(false)
        Keyboard.dismiss()
      },
      [onChangeText, onSelect, onClose]
    )

    const clearFocusAndClose = useCallback(
      (focusId: string | null) => {
        if (isOpened) {
          // using requestAnimationFrame to make sure no other item was selected in the mean time
          requestAnimationFrame(() => {
            setFocusedItem((id) => {
              if (id === focusId) {
                setIsOpened(false)

                // @Todo remove this asap and think about a different implementation alltogether - the hack also necessitates to delay the event handler call to the next rendercycle (on mobile)
                requestAnimationFrame(() => {
                  onClose?.(suggestions.find((i) => i.label === searchText))
                })
                return null
              }
              return id
            })
          })
        }
      },
      [isOpened, onClose, searchText, suggestions]
    )

    const setFocusAndOpen = useCallback((focusId: string) => {
      setIsOpened(true)
      setFocusedItem(focusId)
    }, [])

    const onTextinputBlur = useCallback(() => {
      clearFocusAndClose(focusedItem)
    }, [clearFocusAndClose, focusedItem])

    const onSubmitEditing = useCallback(() => {
      onSubmit?.(searchText || '')
      setIsOpened(false)
    }, [onSubmit, searchText])

    const trailingComponent = useMemo(() => {
      const icon = loading ? Loader : trailingIcon || Search
      return (
        <SpinningIconContainer spinning={loading}>
          <HoliIcon icon={icon} size={22} />
        </SpinningIconContainer>
      )
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
            isOpened ? (
              suggestions.map((suggestion, index) => (
                <HoliAutocompleteItem
                  key={suggestion.id}
                  suggestion={suggestion}
                  isLast={index === suggestions.length - 1}
                  onBlur={onTextinputBlur}
                  onFocus={() => setFocusAndOpen('suggestion-' + suggestion.id)}
                  onPress={handleItemSelection}
                  testID={testID}
                />
              ))
            ) : (
              <></>
            )
          }
        </View>
      </View>
    )
  }
)

HoliAutocomplete.displayName = 'HoliAutocomplete'

export default memo(HoliAutocomplete)

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
