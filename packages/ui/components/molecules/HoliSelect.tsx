// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import React, { ReactChild, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import tinycolor from 'tinycolor2'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliSelectOption = {
  id: string
  title: string
  selected?: boolean
}

export type HoliSelectProps = {
  inputLabel?: string
  accessibilityLabel: string
  placeholder?: string
  helperText?: string
  validationErrorText?: string
  initialSearchText?: string
  onSelectOption: (option: HoliSelectOption) => void
  style?: StyleProp<ViewStyle>
  options: HoliSelectOption[]
  testID?: string
  inputProps?: TextInputProps
  id: string
  multiSelect?: boolean
  onChangeText?: (value: string) => void
  filterOptions?: boolean
  trailingIcon?: ReactChild
  selectionAsPlaceholder?: boolean
  onSubmit?: (value: string) => void
  noResultsText?: string
  hideListWithoutOptions?: boolean
}

const HoliSelect = ({
  style = {},
  multiSelect = false,
  filterOptions = true,
  selectionAsPlaceholder = true,
  hideListWithoutOptions = false,
  accessibilityLabel,
  inputLabel,
  placeholder,
  helperText,
  validationErrorText,
  initialSearchText,
  noResultsText,
  onSelectOption,
  onChangeText,
  onSubmit,
  inputProps,
  options,
  trailingIcon,
  id,
  testID,
}: HoliSelectProps) => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState(initialSearchText || '')
  const [isOpened, setIsOpened] = useState(false)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)
  const [textInputHeight, setTextInputHeight] = useState(0)

  const styles = useMemo(() => getStyles(textInputHeight), [textInputHeight])

  const determineTextInputHeight = useCallback(
    (event) => setTextInputHeight(event.nativeEvent.layout.height),
    [setTextInputHeight]
  )

  const handleTextChange = useCallback(
    (text: string) => {
      setIsOpened(true)
      setSearchText(text)
      return onChangeText && onChangeText(text)
    },
    [setSearchText, setIsOpened, onChangeText]
  )

  const clearFocus = useCallback(
    (focusToClear) => {
      // without the timeout the dropdown closes upon selecting an item
      // we first wait if another element is focused in the meantime
      const timer = setTimeout(() => {
        setFocusedItem((currentlyFocusedItem) => {
          // always close when clicking on the toggle button on mobile
          if (Platform.OS !== 'web' && focusToClear === 'toggle') return null
          return currentlyFocusedItem === focusToClear ? null : currentlyFocusedItem
        })
      }, 0)
      return () => clearTimeout(timer)
    },
    [setFocusedItem]
  )

  // Reset component if not focused anymore
  useEffect(() => {
    if (!focusedItem) {
      setIsOpened(false)
      if (selectionAsPlaceholder) {
        setSearchText('')
      }
      Platform.OS !== 'web' && Keyboard.dismiss()
    }
  }, [focusedItem, setIsOpened, setSearchText, selectionAsPlaceholder])

  // Update search text if value changes from outside (e.g. cleared)
  useEffect(() => {
    !selectionAsPlaceholder && setSearchText(initialSearchText || '')
  }, [selectionAsPlaceholder, initialSearchText])

  const setFocusAndOpen = useCallback(
    (focusId) => {
      setIsOpened(true)
      setFocusedItem(focusId)
    },
    [setFocusedItem, setIsOpened]
  )

  const handleOptionSelection = useCallback(
    (option) => {
      onSelectOption(option)
      if (!multiSelect) {
        setIsOpened(false)
        setSearchText(selectionAsPlaceholder ? '' : option.title)
        Keyboard.dismiss()
      }
    },
    [onSelectOption, setIsOpened, setSearchText, multiSelect, selectionAsPlaceholder]
  )

  const onSubmitEditing = useCallback(() => {
    if (onSubmit) {
      onSubmit(searchText || '')
      clearFocus('input')
    }
  }, [onSubmit, searchText, clearFocus])

  const toggleMenu = useCallback(() => {
    if (isOpened) {
      clearFocus('toggle')
    } else {
      setFocusAndOpen('toggle')
    }
    return true
  }, [isOpened, clearFocus, setFocusAndOpen])

  const renderItem = useCallback(
    ({ item }) => (
      <HoliButton
        inline
        transparent
        key={item.id}
        label={item.title}
        accessibilityRole="menuitem"
        onBlur={() => clearFocus('option-' + item.id)}
        style={styles.listItem}
        contentStyle={styles.listItemContent}
        onFocus={() => setFocusAndOpen('option-' + item.id)}
        onPress={() => handleOptionSelection(item)}
        testID={testID && `${testID}-item`}
        accessibilityChecked={item.selected}
        accessibilityState={{ checked: item.selected }}
      >
        <HoliText selectable={false} numberOfLines={2}>
          {item.title}
        </HoliText>
        <View
          style={[
            styles.listItemIconContainer,
            multiSelect && styles.listItemIconContainerMultiSelect,
            item.selected && styles.listItemIconContainerSelected,
          ]}
        >
          {item.selected && <HoliIcon icon="check" size={20} color={colors.fontColorWhite} />}
        </View>
      </HoliButton>
    ),
    [testID, setFocusAndOpen, clearFocus, handleOptionSelection, styles, multiSelect]
  )

  const noOptions = (
    <View style={styles.listItem}>
      <HoliText>{noResultsText || t('multiselect.empty')}</HoliText>
    </View>
  )

  const toggleMenuButton = useMemo(
    () => (
      <HoliButton
        label={t(isOpened ? 'multiselect.close' : 'multiselect.open')}
        transparent
        inline
        onPress={toggleMenu}
        onFocus={() => setFocusedItem('toggle')}
        onBlur={() => clearFocus('toggle')}
        testID={testID && `${testID}-toggle-menu`}
      >
        {trailingIcon || <HoliIcon icon={isOpened ? 'arrow-up-s' : 'arrow-down-s'} size={22} />}
      </HoliButton>
    ),
    [isOpened, t, toggleMenu, setFocusedItem, clearFocus, testID, trailingIcon]
  )
  const clearInputButton = useMemo(() => {
    return (
      <HoliButton
        label={t('multiselect.clear')}
        transparent
        onPress={() => handleTextChange('')}
        onFocus={() => setFocusedItem('clear')}
        onBlur={() => clearFocus('clear')}
        testID={testID && `${testID}-clear-input`}
        style={styles.clearInputButton}
      >
        <HoliIcon icon="close" filled size={16} />
      </HoliButton>
    )
  }, [t, testID, handleTextChange, setFocusedItem, clearFocus, styles])
  const trailingComponent = useMemo(() => {
    return (
      <View style={styles.trailingIconContainer}>
        {!!searchText && clearInputButton}
        {toggleMenuButton}
      </View>
    )
  }, [clearInputButton, searchText, toggleMenuButton, styles])

  const regex = useMemo(() => searchText && new RegExp(searchText, 'i'), [searchText])
  const selectedOptions = options.filter((option) => option.selected)
  const selectedText =
    selectedOptions.length === 1
      ? selectedOptions[0].title
      : selectedOptions.length > 1 && `${inputLabel} · ${selectedOptions.length}`
  const filteredOptions = useMemo(
    () => (filterOptions ? options.filter((option) => !regex || option.title.match(regex)) : options),
    [options, regex, filterOptions]
  )
  const listVisible = isOpened && (filteredOptions.length > 0 || !hideListWithoutOptions)

  const placeholderTextColor =
    selectionAsPlaceholder && selectedText ? colors.fontColor : tinycolor(colors.fontColorGrey).lighten(30).toString()

  /**
   * TODO:
   * - Check onLayout the screen position of the element in order to avoid the dropdown list items
   * overflowing the screen (we might need a fullscreen dropdown depending on screen height and y position)
   *
   * - Add a modal wrapper to close the dropdown when clicking outside (needed for mobile)
   */
  return (
    <View style={style} onLayout={determineTextInputHeight}>
      <HoliTextInput
        inputLabel={inputLabel}
        value={searchText}
        placeholder={(selectionAsPlaceholder && selectedText) || placeholder}
        validationErrorText={validationErrorText}
        helperText={isOpened && options.length ? undefined : helperText}
        accessibilityLabel={accessibilityLabel}
        accessibilityAutoComplete="list"
        accessibilityControls={`${id}-options`}
        accessibilityRole="combobox"
        accessibilityExpanded={isOpened}
        accessibilityHasPopup="menu"
        trailingComponent={trailingComponent}
        inputProps={{ ...inputProps, placeholderTextColor, onSubmitEditing }}
        inputStyle={[(!!focusedItem || listVisible) && styles.textInputFocused, listVisible && styles.textInputOpened]}
        labelStyle={isOpened ? styles.textInputLabelOpened : {}}
        onChange={handleTextChange}
        onBlur={() => clearFocus('input')}
        onFocus={() => setFocusAndOpen('input')}
        testID={testID}
      />
      {listVisible && (
        <FlatList
          bounces={false}
          ListEmptyComponent={noOptions}
          data={filteredOptions}
          renderItem={renderItem}
          keyExtractor={(option) => option.id}
          style={styles.optionsMenu}
          nativeID={`${id}-options`}
          accessibilityRole="menu"
          keyboardShouldPersistTaps="always"
          persistentScrollbar={true}
          accessibilityLabel={t('multiselect.options')}
          accessibilityState={{ expanded: true }}
        />
      )}
    </View>
  )
}

export default memo(HoliSelect)

const LIST_ITEM_HEIGHT = 48

const getStyles = (textInputHeight: number) =>
  StyleSheet.create({
    selectedOptionsPreview: {
      marginBottom: 6,
    },
    textInputFocused: {
      borderColor: colors.borderColorSecondary,
    },
    textInputOpened: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    textInputLabelOpened: {
      color: colors.secondaryColor,
    },
    optionsMenu: {
      maxHeight: LIST_ITEM_HEIGHT * 4,
      borderColor: colors.borderColorSecondary,
      borderWidth: 2,
      borderTopWidth: 0,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      position: 'absolute',
      width: '100%',
      top: textInputHeight - 3, // Display above bottom border of input field
      backgroundColor: colors.backgroundColorWhite,
    },
    listItem: {
      height: LIST_ITEM_HEIGHT,
      display: 'flex',
      paddingHorizontal: 12,
      justifyContent: 'center',
    },
    listItemContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    listItemIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: tinycolor(colors.borderColorGrey).darken(5).toString(),
      alignItems: 'center',
      justifyContent: 'center',
    },
    listItemIconContainerMultiSelect: {
      borderRadius: 4,
    },
    listItemIconContainerSelected: {
      borderWidth: 0,
      backgroundColor: colors.fontColorBlack,
    },
    trailingIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    clearInputButton: {
      width: 22,
    },
  })
