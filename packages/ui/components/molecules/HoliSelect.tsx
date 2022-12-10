import { OptionType, Select, SelectModalProvider, SelectRef } from '@mobile-reality/react-native-select-pro'
import React, { memo, useCallback, useRef, useState } from 'react'
import { AccessibilityProps, Platform, StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const LINE_HEIGHT = 16 * 1.4
const INPUT_HEIGHT = 56

export type HoliSelectOptions = OptionType[]

export type HoliSelectProps = {
  inputLabel?: string
  accessibilityLabel: string
  placeholder?: string
  dropdownIconLabel: string
  noOptionsText?: string
  value?: string
  onChange?: (value: string) => void
  style?: StyleProp<ViewStyle>
  textInputProps?: TextInputProps
  options: HoliSelectOptions
  searchable?: boolean
  clearable?: boolean
  clearLabel?: string
  inModal?: boolean
}

const HoliSelect = ({
  style = {},
  options = [],
  inputLabel,
  accessibilityLabel,
  placeholder,
  dropdownIconLabel,
  noOptionsText,
  textInputProps,
  clearable = false,
  clearLabel,
  value,
  onChange,
  searchable = false,
  inModal = false,
}: HoliSelectProps) => {
  const ref = useRef<SelectRef>(null)
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const initialSelection = options.find((option) => option.value === value)
  const [isFocused, setFocused] = useState(false)
  const [isHovered, setHovered] = useState(false)
  const hoverPropsForWeb = Platform.select({
    web: {
      onMouseOver: () => setHovered(true),
      onMouseOut: () => setHovered(false),
    },
  })
  const handleSelect = useCallback(
    (option) => {
      option && onChange && onChange(option.value)
    },
    [onChange]
  )

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: true,
    accessibilityLabel,
  }
  const inputProps = {
    ...accessibilityProps,
    ...textInputProps,
  }
  const [listStyle, setListStyle] = useState<ViewStyle>({})
  const onOpenDropdown = useCallback(() => {
    setFocused(true)
    // TODO: workaround for list positioning
    const displayList = setListStyle
    setTimeout(() => {
      const state = ref.current?.getState()
      if (state?.openedPosition) {
        displayList({
          marginTop: inModal ? -state?.openedPosition.top + INPUT_HEIGHT + 20 : -2,
          marginLeft: inModal ? -state?.openedPosition.left : 0,
          display: 'flex',
        })
      }
    }, 50)
  }, [setListStyle, inModal])
  const onCloseDropdown = useCallback(() => {
    setFocused(false)
  }, [setFocused])

  const NoOptionComponent = (
    <View style={[styles.option, styles.noOption]}>
      <HoliText>{noOptionsText}</HoliText>
    </View>
  )

  const select = (
    <Select
      ref={ref}
      options={options}
      defaultOption={initialSelection}
      placeholderText={placeholder}
      selectControlOpenDropdownA11yLabel={dropdownIconLabel}
      selectControlClearOptionA11yLabel={clearLabel}
      clearable={clearable}
      scrollToSelectedOption={false}
      onSelect={handleSelect}
      onDropdownOpened={onOpenDropdown}
      onDropdownClosed={onCloseDropdown}
      optionsListStyle={[styles.optionsList, listStyle]}
      selectControlStyle={[
        styles.selectControl,
        isHovered && styles.selectControlHovered,
        isFocused && styles.selectControlFocused,
      ]}
      selectControlTextStyle={styles.textStyle}
      placeholderTextColor={tinycolor(colors.fontColorGrey).lighten(30).toString()}
      selectControlArrowImageStyle={styles.icon}
      selectControlClearOptionImageStyle={styles.icon}
      selectControlClearOptionButtonStyle={styles.clearIcon}
      selectControlButtonsContainerStyle={styles.iconContainer}
      optionStyle={styles.option}
      optionSelectedStyle={styles.selectedOption}
      optionTextStyle={styles.textStyle}
      searchable={searchable}
      NoOptionsComponent={NoOptionComponent}
      textInputProps={inputProps}
    />
  )

  return (
    <View style={[styles.wrapper, style]} {...hoverPropsForWeb}>
      <View style={styles.labelWrapper}>
        <HoliText size="small" bold style={[styles.label, isFocused && styles.labelFocused]}>
          {inputLabel}
        </HoliText>
      </View>
      {inModal ? <SelectModalProvider>{select}</SelectModalProvider> : select}
    </View>
  )
}

export default memo(HoliSelect)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    selectControl: {
      borderWidth: 2,
      borderColor: colors.borderColorGrey,
      borderRadius: 4,
      backgroundColor: colors.backgroundColor,
      height: INPUT_HEIGHT,
    },
    textStyle: {
      fontSize: 16,
      lineHeight: LINE_HEIGHT,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: colors.fontColor,
    },
    icon: {
      tintColor: colors.fontColor,
    },
    clearIcon: {
      // TODO: change style of clear icon for web?
    },
    selectControlFocused: {
      borderColor: colors.borderColorSecondary,
    },
    selectControlHovered: {
      borderColor: tinycolor(colors.borderColorBlack).lighten(35).toString(),
    },
    optionsList: {
      display: 'none', // Hidden until positioned properly
      borderColor: colors.borderColorSecondary,
      borderWidth: 2,
      borderTopWidth: 0,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      backgroundColor: colors.backgroundColor,
      elevation: 0,
    },
    option: {
      height: 48,
    },
    selectedOption: {
      backgroundColor: colors.backgroundColorGrey,
    },
    noOption: {
      paddingHorizontal: 12,
      justifyContent: 'center',
    },
    labelWrapper: {
      marginBottom: 6,
    },
    label: {
      color: colors.fontColor,
    },
    labelFocused: {
      color: colors.secondaryColor,
    },
    // TODO: workaround to move container that prevents clicking on web
    wrapper: {
      marginBottom: Platform.OS === 'web' ? 120 : 0,
    },
  })
