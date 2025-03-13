// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import React, { memo, useMemo, useState } from 'react'
import { Keyboard, type StyleProp, StyleSheet, type TextInputProps, View, type ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader, Search } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type Suggestion = {
  id: string
  label: string
  city?: string
  state?: string
  country?: string
}
interface AutocompleteItemProps {
  suggestion: Suggestion
  onFocus?: (suggestion: Suggestion) => void
  onBlur?: (suggestion: Suggestion) => void
  onPress?: (suggestion: Suggestion) => void
  isLast: boolean
  testID?: string
}
const HoliAutocompleteItem: React.FC<AutocompleteItemProps> = ({
  suggestion,
  onBlur,
  onFocus,
  onPress,
  testID,
  isLast,
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <HoliButton
      inline
      transparent
      label={suggestion.label}
      role="menuitem"
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
  'aria-label': string
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
  onBlur?: (value: string) => void
  onSelect?: (value: Suggestion) => void // should probably handle the non selection case
  onClose?: (value?: Suggestion) => void
  suggestionsStyle?: StyleProp<ViewStyle>
  clearInputComponent?: React.ReactElement
}

const HoliAutocomplete = React.forwardRef<View, HoliAutocompleteProps>(
  (
    {
      style = {},
      'aria-label': ariaLabel,
      value,
      inputLabel,
      placeholder,
      helperText,
      validationErrorText,
      onChange,
      loading,
      inputProps,
      trailingIcon = Search,
      clearInputComponent,
      suggestions = [],
      id, // think about encapsulating the selection mechanism from the ground up
      testID,
      onSubmit, // why do we need this?
      onSelect,
      onClose,
      onBlur,
      suggestionsStyle = {},
    },
    ref
  ) => {
    const [isOpened, setIsOpened] = useState(false)
    const [focusedItem, setFocusedItem] = useState<string | null>(null)
    const { theme } = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])

    const onChangeText = (text: string) => {
      setIsOpened(true)
      onChange?.(text)
    }

    const handleItemSelection = (item: Suggestion) => {
      onSelect?.(item)
      onClose?.(item)
      onChangeText(item.label)
      setIsOpened(false)
      Keyboard.dismiss()
    }

    const setFocusAndOpen = (focusId: string) => {
      setIsOpened(true)
      setFocusedItem(focusId)
    }

    const clearFocusAndClose = (focusId: string | null) => {
      if (isOpened) {
        // using requestAnimationFrame to make sure no other item was selected in the mean time
        requestAnimationFrame(() => {
          setFocusedItem((id) => {
            if (id === focusId) {
              setIsOpened(false)

              // @Todo remove this asap and think about a different implementation alltogether - the hack also necessitates to delay the event handler call to the next rendercycle (on mobile)
              requestAnimationFrame(() => {
                onClose?.(suggestions.find(({ label }) => label === value))
              })
              return null
            }
            return id
          })
        })
      }
    }

    const onBlurHandler = () => {
      clearFocusAndClose(focusedItem)
      onBlur?.(value || '')
    }

    const onSubmitEditing = () => {
      onSubmit?.(value || '')
      setIsOpened(false)
    }

    const trailingComponent = useMemo(() => {
      if (!loading && clearInputComponent && value) {
        return clearInputComponent
      }
      const icon = loading ? Loader : trailingIcon
      return (
        <SpinningIconContainer spinning={loading}>
          <HoliIcon icon={icon} size={22} />
        </SpinningIconContainer>
      )
    }, [trailingIcon, loading, clearInputComponent, value])

    return (
      <View style={style}>
        <HoliTextInput
          inputLabel={inputLabel}
          value={value}
          placeholder={placeholder}
          validationErrorText={!isOpened ? validationErrorText : undefined} // hide it when opening the suggestions
          helperText={isOpened && suggestions.length ? undefined : helperText}
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-controls={`${id}-suggestions`}
          role="combobox"
          ariaExpanded={isOpened}
          ariaHasPopup="menu"
          trailingComponent={trailingComponent}
          inputProps={{ ...inputProps, onSubmitEditing }}
          labelStyle={!!focusedItem && styles.textInputLabelFocused}
          onChange={onChangeText}
          onBlur={onBlurHandler}
          onFocus={() => setFocusAndOpen('input')}
          testID={testID}
          ref={ref}
        />
        <View id={`${id}-suggestions`} role="menu" style={[styles.listContainer, suggestionsStyle]}>
          {
            /** FIXME convert to VirtualizedList, FlatList or SectionList */
            isOpened && value ? (
              suggestions.map((suggestion, index) => (
                <HoliAutocompleteItem
                  key={suggestion.id}
                  suggestion={suggestion}
                  isLast={index === suggestions.length - 1}
                  onFocus={() => setFocusAndOpen('suggestion-' + suggestion.id)}
                  onPress={handleItemSelection}
                  onBlur={onBlurHandler}
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    textInputOpened: {
      borderBottomWidth: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    textInputLabelFocused: {
      color: theme.colors.brandColorB30,
    },
    listContainer: {
      top: -3,
      backgroundColor: theme.colors.white100,
    },
    listItem: {
      height: 48,
      paddingHorizontal: 12,
      justifyContent: 'center',
      display: 'flex',
      borderColor: theme.colors.brandColorB30,
      borderLeftWidth: 2,
      borderRightWidth: 2,
    },
    listItemLast: {
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      borderBottomWidth: 2,
    },
  })
