import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ArrowDownS, ArrowUpS, Global } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type HoliModalSelectVariant = 'normal' | 'dense' // for working code completion in vscode
export const HoliModalSelectVariants: HoliModalSelectVariant[] = ['normal', 'dense'] // keep in sync with all possible HoliModalSelectVariant values

export type HoliModalSelectOption<IDType extends string = string> = {
  id: IDType
  title: string
  description?: string
  icon?: HoliIconType
  selected?: boolean
  disabled?: boolean
}

export type HoliModalSelectProps<IDType extends string = string> = {
  options: HoliModalSelectOption<IDType>[]
  onChange: (option: HoliModalSelectOption<IDType>) => void
  title: string
  label: string
  description?: string
  placeholder?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  isRequired?: boolean
  variant?: HoliModalSelectVariant
  showOptionIcon?: boolean
  hideButton?: boolean
  show: () => void
  hide: () => void
  visible: boolean
}

const HoliModalSelect = <IDType extends string>({
  options,
  onChange = () => null,
  title,
  label,
  description,
  placeholder,
  style,
  testID = 'holi-modal-select',
  isRequired,
  variant = 'normal',
  showOptionIcon = false,
  hideButton = false,
  show,
  hide,
  visible,
}: HoliModalSelectProps<IDType>) => {
  const [selectedOption, setSelectedOption] = useState<HoliModalSelectOption<IDType> | undefined>()
  const [hovered, setHovered] = useState(false)

  const mixins = useStyleMixins()
  const isDense = variant === 'dense'
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(isDense, theme), [isDense, theme])

  useEffect(() => setSelectedOption(options.find((option) => option.selected)), [options])

  const hoverPropsForWeb = Platform.select({
    web: {
      onMouseEnter: () => setHovered(true),
      onMouseOut: () => setHovered(false),
    },
  })

  const handleOnChange = useCallback(
    async (option: HoliModalSelectOption<IDType>) => {
      await hide()
      onChange(option)
    },
    [onChange, hide]
  )

  const renderOption = useCallback(
    (option: HoliModalSelectOption<IDType>) => (
      <HoliButton
        contentStyle={styles.optionCardContent}
        label={option.title}
        key={option.id}
        transparent
        disabled={option.disabled}
        onPress={() => {
          handleOnChange(option)
        }}
        testID={`item-${testID}-${option.id}`}
      >
        {!isDense && (
          <HoliIcon
            icon={option.icon || Global}
            size={22}
            color={option?.disabled ? colors.foreground10 : colors.foreground30}
          />
        )}
        <View style={styles.optionTextContainer}>
          <HoliText bold color={option?.disabled ? 'gray200' : 'black300'}>
            {option.title}
          </HoliText>
          {!isDense && option.description && (
            <HoliBox padding={[4, 0, 0, 0]}>
              <HoliText color={option?.disabled ? 'gray200' : 'gray300'}>{option.description}</HoliText>
            </HoliBox>
          )}
        </View>
        <HoliCheckbox
          shape="round"
          checked={option.selected}
          autofocus={false}
          disabled={option.disabled}
          testID={`${option.selected ? 'checked-' : ''}${testID}`}
          aria-label={option.title}
        />
      </HoliButton>
    ),
    [
      styles.optionCardContent,
      styles.optionTextContainer,
      isDense,
      testID,
      handleOnChange,
      colors.foreground10,
      colors.foreground30,
    ]
  )

  return (
    <>
      {!hideButton && (
        <View style={style}>
          {!!label && (
            <View style={styles.labelWrapper}>
              <HoliText size="small" bold style={styles.label}>
                {label}
                <HoliMandatoryFieldStar show={!!isRequired} />
              </HoliText>
            </View>
          )}
          <HoliButton
            label={title}
            testID={`btn-${testID}`}
            transparent
            contentStyle={[styles.button, hovered && styles.buttonHovered]}
            onPress={show}
            {...hoverPropsForWeb}
          >
            {selectedOption ? (
              <View style={styles.selectedOptionContainer}>
                {showOptionIcon && selectedOption.icon && <HoliIcon icon={selectedOption.icon} />}
                <HoliText style={styles.selectedOptionTitle}>{selectedOption.title}</HoliText>
              </View>
            ) : (
              <HoliText style={styles.placeholder}>{placeholder}</HoliText>
            )}
            <HoliIcon icon={visible ? ArrowUpS : ArrowDownS} size={22} />
          </HoliButton>
        </View>
      )}

      <HoliModal
        show={visible}
        onDismiss={hide}
        onShow={show}
        label={label}
        statusBarTranslucent
        style={styles.modal}
        testID={testID}
      >
        <ScrollView style={mixins.container}>
          <HoliBox padding={[0, 0, Spacing.xs, 0]}>
            <HoliHeading level="2">{label}</HoliHeading>
          </HoliBox>
          {!!description && <HoliText style={styles.description}>{description}</HoliText>}
          {isDense && <View style={styles.separator} />}
          <View style={styles.optionsContainer}>{options.map(renderOption)}</View>
        </ScrollView>
      </HoliModal>
    </>
  )
}

export default HoliModalSelect

const getStyles = (isDense: boolean, theme: HoliTheme) =>
  StyleSheet.create({
    labelWrapper: {
      marginBottom: 6,
      flexDirection: 'row',
    },
    label: {
      color: theme.colors.foreground30,
    },
    button: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.xxs,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background10,
      color: theme.colors.foreground30,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.background30,
    },
    buttonHovered: {
      borderColor: theme.colors.foreground20,
    },
    placeholder: {
      color: theme.colors.foreground20,
    },
    modal: {
      backgroundColor: isDense ? theme.colors.background10 : theme.colors.background30,
    },
    optionsContainer: {
      paddingBottom: 28,
      gap: isDense ? 0 : Spacing.xs,
    },
    optionCardContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: isDense ? undefined : Spacing.xs,
      paddingVertical: isDense ? Spacing.xxs : undefined,
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.xs,
      borderWidth: isDense ? 0 : 1,
      borderColor: theme.colors.background30,
    },
    optionTextContainer: {
      flex: 1,
      marginTop: 2,
      paddingLeft: isDense ? 0 : Spacing['3xs'],
      paddingRight: Spacing['3xs'],
    },
    separator: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      marginBottom: Spacing.xs,
    },
    description: {
      color: theme.colors.foreground20,
      paddingBottom: Spacing.xs,
    },
    selectedOptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      maxWidth: '90%',
    },
    selectedOptionTitle: {
      marginLeft: Spacing.xxs,
    },
  })
