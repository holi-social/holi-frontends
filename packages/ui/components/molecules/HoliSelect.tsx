// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  type StyleProp,
  StyleSheet,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowDownS, ArrowUpS, Check, Close } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliSelectOption = {
  id: string
  title?: string
  keyPrefix?: string
  selected?: boolean
}

export interface HoliSelectProps {
  inputLabel?: string
  'aria-label': string
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
  multiSelectionLabel?: string
  isRequired?: boolean
  virtualized?: boolean
}

const HoliSelect = ({
  style = {},
  multiSelect = false,
  'aria-label': ariaLabel,
  inputLabel,
  placeholder,
  helperText,
  validationErrorText,
  multiSelectionLabel,
  onChange,
  inputProps,
  options,
  id,
  testID,
  isRequired,
  virtualized,
}: HoliSelectProps) => {
  const { t } = useTranslation()
  options = options.map((option) => (!option.title ? { ...option, title: t(option.keyPrefix + option.id) } : option))
  const [searchText, setSearchText] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)
  const [textInputHeight, setTextInputHeight] = useState(0)
  const isScrolling = useRef(false)

  const setIsScrolling = useCallback(
    (newIsScrolling: boolean) => () => {
      isScrolling.current = newIsScrolling
    },
    []
  )

  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(textInputHeight, theme), [textInputHeight, theme])

  const determineTextInputHeight = useCallback(
    (event: LayoutChangeEvent) => setTextInputHeight(event.nativeEvent.layout.height),
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
    (focusToClear: string) => {
      // without the timeout the dropdown closes upon selecting an item
      // we should first wait if another element is focused in the meantime
      const timer = setTimeout(() => {
        setFocusedItem((currentlyFocusedItem) => {
          // always close when clicking on the toggle button on mobile
          if (Platform.OS !== 'web' && focusToClear === 'toggle') return null
          // On iOS the input field's focus gets lost during scrolling, if a
          // previous scroll interaction did not run out of momentum yet.
          // We can not prevent the input from losing focus, but we ignore
          // changing the `focusedItem` so the dropdown stays open.
          if (Platform.OS === 'ios' && isScrolling.current) return currentlyFocusedItem
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
      if (Platform.OS !== 'web') Keyboard.dismiss()
    }
  }, [focusedItem, setIsOpened, setSearchText])

  const setFocusAndOpen = useCallback(
    (focusId: string) => {
      setIsOpened(true)
      setFocusedItem(focusId)
    },
    [setFocusedItem, setIsOpened]
  )

  const onSelect = useCallback(
    (option: HoliSelectOption) => {
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
    ({ item }: { item: HoliSelectOption }) => (
      <HoliButton
        inline
        transparent
        key={item.id}
        label={item.title ?? ''}
        role={Platform.select({
          web: multiSelect ? 'menuitemcheckbox' : 'menuitemradio',
          native: 'menuitem',
        })}
        onBlur={() => clearFocus('option-' + item.id)}
        style={styles.listItem}
        contentStyle={styles.listItemContent}
        onFocus={() => setFocusAndOpen('option-' + item.id)}
        onPress={() => onSelect(item)}
        testID={testID && `${testID}-item`}
        ariaChecked={item.selected}
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
          {item.selected && <HoliIcon icon={Check} size={20} color={colors.background10} />}
        </View>
      </HoliButton>
    ),
    [testID, setFocusAndOpen, clearFocus, onSelect, styles, multiSelect, colors.background10]
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
        <HoliIcon icon={isOpened ? ArrowUpS : ArrowDownS} size={22} />
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
        <HoliIcon icon={Close} filled size={16} />
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
      : selectedOptions.length > 1 && `${multiSelectionLabel || inputLabel} · ${selectedOptions.length}`
  const filteredOptions = useMemo(
    () => options.filter((option) => !regex || option.title?.match(regex)),
    [options, regex]
  )

  const placeholderTextColor = selectedText ? colors.foreground30 : colors.foreground20

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
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-controls={isOpened ? `${id}-options` : undefined}
        role="combobox"
        ariaExpanded={isOpened}
        ariaHasPopup="menu"
        trailingComponent={trailingComponent}
        inputProps={{ ...inputProps, placeholderTextColor }}
        labelStyle={isOpened ? styles.textInputLabelOpened : {}}
        onChange={onChangeText}
        onBlur={() => clearFocus('input')}
        onFocus={() => setFocusAndOpen('input')}
        isRequired={isRequired}
        testID={testID}
      />
      {isOpened &&
        (virtualized ? (
          <FlatList
            bounces={false}
            ListEmptyComponent={noOptions}
            data={filteredOptions}
            renderItem={renderItem}
            keyExtractor={(option) => option.id}
            style={styles.optionsMenu}
            id={`${id}-options`}
            role="menu"
            keyboardShouldPersistTaps="always"
            persistentScrollbar={true}
            scrollEventThrottle={50}
            aria-label={t('multiselect.options')}
            accessibilityState={{ expanded: true }}
            onMomentumScrollBegin={setIsScrolling(true)}
            onMomentumScrollEnd={setIsScrolling(false)}
          />
        ) : (
          <ScrollView
            bounces={false}
            style={styles.optionsMenu}
            id={`${id}-options`}
            role="menu"
            keyboardShouldPersistTaps="always"
            persistentScrollbar={true}
            scrollEventThrottle={50}
            aria-label={t('multiselect.options')}
            accessibilityState={{ expanded: true }}
            onMomentumScrollBegin={setIsScrolling(true)}
            onMomentumScrollEnd={setIsScrolling(false)}
          >
            {filteredOptions.length
              ? filteredOptions.map((filterOption) => renderItem({ item: filterOption }))
              : noOptions}
          </ScrollView>
        ))}
    </View>
  )
}

export default memo(HoliSelect)

export const LIST_ITEM_HEIGHT = 48
export const LIST_ITEMS_COUNT = 4

const getStyles = (textInputHeight: number, theme: HoliTheme) =>
  StyleSheet.create({
    selectedOptionsPreview: {
      marginBottom: 6,
    },
    textInputLabelOpened: {
      color: theme.colors.brandColorB30,
    },
    optionsMenu: {
      maxHeight: LIST_ITEM_HEIGHT * LIST_ITEMS_COUNT,
      borderColor: theme.colors.brandColorB30,
      borderWidth: 2,
      borderTopWidth: 0,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      position: 'absolute',
      width: '100%',
      top: textInputHeight - 3, // Display above bottom border of input field
      backgroundColor: theme.colors.background10,
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
      borderColor: theme.colors.foreground10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listItemIconContainerMultiSelect: {
      borderRadius: 4,
    },
    listItemIconContainerSelected: {
      borderWidth: 0,
      backgroundColor: theme.colors.foreground30,
    },
    trailingIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    clearInputButton: {
      width: 22,
    },
  })
