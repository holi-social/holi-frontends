// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
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
  onChange: (option: HoliSelectOption) => void
  style?: StyleProp<ViewStyle>
  options: HoliSelectOption[]
  testID?: string
  inputProps?: TextInputProps
  id: string
  multiSelect?: boolean
}

const HoliSelect = ({
  style = {},
  multiSelect = false,
  accessibilityLabel,
  inputLabel,
  placeholder,
  helperText,
  validationErrorText,
  onChange,
  inputProps,
  options,
  id,
  testID,
}: HoliSelectProps) => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)
  const [textInputHeight, setTextInputHeight] = useState(0)

  const styles = useMemo(() => getStyles(textInputHeight), [textInputHeight])

  const determineTextInputHeight = useCallback(
    (event) => setTextInputHeight(event.nativeEvent.layout.height),
    [setTextInputHeight]
  )

  const onChangeText = useCallback(
    (text: string) => {
      setIsOpened(true)
      return setSearchText(text)
    },
    [setSearchText, setIsOpened]
  )

  const clearFocus = useCallback(
    (focusToClear) => {
      // without the timeout the dropdown closes upon selecting an item
      // we should first wait if another element is focused in the meantime
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
      setSearchText('')
      Platform.OS !== 'web' && Keyboard.dismiss()
    }
  }, [focusedItem, setIsOpened, setSearchText])

  const setFocusAndOpen = useCallback(
    (focusId) => {
      setIsOpened(true)
      setFocusedItem(focusId)
    },
    [setFocusedItem, setIsOpened]
  )

  const onSelect = useCallback(
    (option) => {
      onChange(option)
      if (!multiSelect) {
        setIsOpened(false)
        setSearchText('')
        Keyboard.dismiss()
      }
    },
    [onChange, setIsOpened, setSearchText, multiSelect]
  )
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
        onPress={() => onSelect(item)}
        testID={testID && `${testID}-item`}
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
    [testID, setFocusAndOpen, clearFocus, onSelect, styles, multiSelect]
  )

  const noOptions = (
    <View style={styles.listItem}>
      <HoliText>{t('multiselect.empty')}</HoliText>
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
        <HoliIcon icon={isOpened ? 'arrow-up-s' : 'arrow-down-s'} size={22} />
      </HoliButton>
    ),
    [isOpened, t, toggleMenu, setFocusedItem, clearFocus, testID]
  )
  const clearInputButton = useMemo(() => {
    return (
      <HoliButton
        label={t('multiselect.clear')}
        transparent
        onPress={() => onChangeText('')}
        onFocus={() => setFocusedItem('clear')}
        onBlur={() => clearFocus('clear')}
        testID={testID && `${testID}-clear-input`}
        style={styles.clearInputButton}
      >
        <HoliIcon icon="close" filled size={16} />
      </HoliButton>
    )
  }, [t, testID, onChangeText, setFocusedItem, clearFocus, styles])
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
    () => options.filter((option) => !regex || option.title.match(regex)),
    [options, regex]
  )

  const placeholderTextColor = selectedText ? colors.fontColor : tinycolor(colors.fontColorGrey).lighten(30).toString()

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
        placeholder={selectedText || placeholder}
        validationErrorText={validationErrorText}
        helperText={isOpened && options.length ? undefined : helperText}
        accessibilityLabel={accessibilityLabel}
        accessibilityAutoComplete="list"
        accessibilityControls={`${id}-options`}
        accessibilityRole="combobox"
        accessibilityExpanded={isOpened}
        accessibilityHasPopup="menu"
        trailingComponent={trailingComponent}
        inputProps={{ ...inputProps, placeholderTextColor }}
        inputStyle={isOpened ? styles.textInputOpened : {}}
        labelStyle={isOpened ? styles.textInputLabelOpened : {}}
        onChange={onChangeText}
        onBlur={() => clearFocus('input')}
        onFocus={() => setFocusAndOpen('input')}
        testID={testID}
      />
      {isOpened && (
        <FlatList
          bounces={false}
          ListEmptyComponent={noOptions}
          data={filteredOptions}
          renderItem={renderItem}
          keyExtractor={(option) => option.id}
          style={isOpened && styles.optionsMenu}
          nativeID={`${id}-options`}
          accessibilityRole="menu"
          keyboardShouldPersistTaps="always"
          persistentScrollbar={true}
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
    textInputOpened: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderColor: colors.borderColorSecondary,
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
