// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, ScrollView, StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliSelectOption = {
  id: string
  title: string
  selected: boolean
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
}

const HoliSelect = ({
  style = {},
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

  const onChangeText = useCallback(
    (text: string) => {
      setIsOpened(true)
      return setSearchText(text)
    },
    [setSearchText, setIsOpened]
  )

  const clearFocusAndClose = useCallback(
    (focusId) => {
      // without the timeout the dropdown closes upon selecting an item
      setTimeout(() => {
        setFocusedItem((id) => {
          if (id === focusId) {
            setIsOpened(false)
            setSearchText('')
            Keyboard.dismiss()
            return null
          }
          return id
        })
      }, 0)
    },
    [setFocusedItem, setIsOpened, setSearchText]
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

  const onSelect = useCallback(
    (option) => {
      onChange(option)
      setIsOpened(false)
      setSearchText('')
    },
    [onChange, setIsOpened, setSearchText]
  )
  // TODO(SF): first toggle on web closes again
  const toggleMenu = useCallback(() => {
    return isOpened ? onBlur() : setFocusAndOpen('toggle')
  }, [isOpened, onBlur, setFocusAndOpen])

  const renderItem = useCallback(
    (item) => (
      <HoliButton
        inline
        transparent
        key={item.id}
        label={item.title}
        accessibilityRole="menuitem"
        onBlur={onBlur}
        style={[styles.listItem, item.selected && styles.listItemSelected]}
        contentStyle={styles.listItemContent}
        onFocus={() => setFocusAndOpen('option-' + item.id)}
        onPress={() => onSelect(item)}
        testID={testID && `${testID}-item-${item.id}`}
      >
        <HoliText selectable={false} numberOfLines={2}>
          {item.title}
        </HoliText>
        {item.selected && <HoliIcon icon="check" size={20} />}
      </HoliButton>
    ),
    [testID, setFocusAndOpen, onBlur, onSelect]
  )

  const noOptions = (
    <View style={styles.listItem}>
      <HoliText>{t('multiselect.empty')}</HoliText>
    </View>
  )

  const trailingComponent = useMemo(
    () => (
      <HoliButton
        label={t(isOpened ? 'multiselect.close' : 'multiselect.open')}
        transparent
        onPress={toggleMenu}
        onFocus={() => setFocusAndOpen('toggle')}
        onBlur={onBlur}
        testID={testID && `${testID}-toggle-menu`}
      >
        <HoliIcon icon={isOpened ? 'arrow-up-s' : 'arrow-down-s'} size={22} />
      </HoliButton>
    ),
    [isOpened, t, toggleMenu, setFocusAndOpen, onBlur, testID]
  )

  const regex = useMemo(() => searchText && new RegExp(searchText, 'i'), [searchText])
  const selectedText = options
    .filter((option) => option.selected)
    .map((option) => option.title)
    .join(', ')
  const filteredOptions = useMemo(
    () => options.filter((option) => !regex || option.title.match(regex)),
    [options, regex]
  )

  const placeholderTextColor = selectedText ? colors.fontColor : tinycolor(colors.fontColorGrey).lighten(30).toString()
  // TODO(SF) list above other content
  return (
    <View style={style}>
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
        onBlur={onBlur}
        onFocus={() => setFocusAndOpen('input')}
        testID={testID}
      />
      <ScrollView
        style={isOpened && styles.optionsMenu}
        nativeID={`${id}-options`}
        accessibilityRole="menu"
        keyboardShouldPersistTaps="always"
      >
        {filteredOptions.length > 0 && isOpened ? filteredOptions.map(renderItem) : isOpened ? noOptions : <></>}
      </ScrollView>
    </View>
  )
}

export default memo(HoliSelect)

const styles = StyleSheet.create({
  selectedOptionsPreview: {
    marginBottom: 6,
  },
  textInputOpened: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: colors.borderColorSecondary,
  },
  textInputLabelOpened: {
    color: colors.secondaryColor,
  },
  optionsMenu: {
    maxHeight: 300,
    borderColor: colors.borderColorSecondary,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  listItem: {
    height: 48,
    display: 'flex',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemSelected: {
    backgroundColor: colors.backgroundColorGreyLight,
  },
})
