// based on https://github.com/onmotion/react-native-autocomplete-dropdown/
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'

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
  onSubmit?: (value: string) => void
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
  onSubmit,
}: HoliSelectProps) => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

  const onChangeText = useCallback(async (text: string) => setSearchText(text), [setSearchText])

  const clearFocusAndClose = useCallback(
    (focusId) => {
      // without the timeout the dropdown closes upon selecting an item
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
        onPress={() => onChange(item)}
        testID={testID && `${testID}-item-${item.id}`}
      >
        <HoliText selectable={false} numberOfLines={2}>
          {item.title}
        </HoliText>
        {item.selected && <HoliIcon icon="check" size={20} />}
      </HoliButton>
    ),
    [testID, setFocusAndOpen, onBlur, onChange]
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
        onPress={() => setIsOpened((isOpened) => !isOpened)}
      >
        <HoliIcon icon={isOpened ? 'arrow-up-s' : 'arrow-down-s'} size={22} />
      </HoliButton>
    ),
    [isOpened, t]
  )

  const selectedOptions = options.filter((option) => option.selected)
  const filteredOptions = options.filter((option) => !searchText || option.title.match(new RegExp(searchText, 'i')))

  return (
    <View style={style}>
      {selectedOptions.length > 0 && (
        <View style={styles.selectedOptionsPreview}>
          <HoliText size="extrasmall">{selectedOptions.map((option) => option.title).join(', ')}</HoliText>
        </View>
      )}
      <HoliTextInput
        inputLabel={inputLabel}
        value={searchText}
        placeholder={placeholder}
        validationErrorText={validationErrorText}
        helperText={isOpened && options.length ? undefined : helperText}
        accessibilityLabel={accessibilityLabel}
        accessibilityAutoComplete="list"
        accessibilityControls={`${id}-options`}
        accessibilityRole="combobox"
        accessibilityExpanded={isOpened}
        accessibilityHasPopup="menu"
        trailingComponent={trailingComponent}
        inputProps={{ ...inputProps, onSubmitEditing }}
        inputStyle={isOpened && options.length ? styles.textInputOpened : {}}
        labelStyle={isOpened ? styles.textInputLabelOpened : {}}
        onChange={onChangeText}
        onBlur={onBlur}
        onFocus={() => setFocusAndOpen('input')}
        testID={testID}
      />
      <ScrollView style={isOpened && styles.optionsMenu} nativeID={`${id}-options`} accessibilityRole="menu">
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
