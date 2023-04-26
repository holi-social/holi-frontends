import React, { useCallback, useEffect, useState } from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type HoliModalSelectVariant = 'normal' | 'dense' // for working code completion in vscode
export const HoliModalSelectVariants: HoliModalSelectVariant[] = ['normal', 'dense'] // keep in sync with all possible HoliModalSelectVariant values

export type HoliModalSelectOption = {
  id: string
  title: string
  description?: string
  icon?: string
  selected?: boolean
}

export type HoliModalSelectProps = {
  options: HoliModalSelectOption[]
  onChange: (option: HoliModalSelectOption) => void
  title: string
  label: string
  description?: string
  placeholder?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  isRequired?: boolean
  variant?: HoliModalSelectVariant
  showOptionIcon?: boolean
}

const HoliModalSelect: React.FC<HoliModalSelectProps> = ({
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
}: HoliModalSelectProps) => {
  const [selectedOption, setSelectedOption] = useState<HoliModalSelectOption | undefined>()
  const [hovered, setHovered] = useState(false)

  const { show, hide, visible } = useModalState()
  const mixins = useStyleMixins()
  const isDense = variant === 'dense'
  const styles = getStyles(isDense)

  useEffect(() => setSelectedOption(options.find((option) => option.selected)), [options])

  const hoverPropsForWeb = Platform.select({
    web: {
      onMouseEnter: () => setHovered(true),
      onMouseOut: () => setHovered(false),
    },
  })

  const renderOption = useCallback(
    (option: HoliModalSelectOption) => (
      <HoliButton
        contentStyle={styles.optionCardContent}
        style={[!isDense && styles.optionCard]}
        label={option.title}
        key={option.id}
        transparent
        onPress={() => {
          onChange(option)
          hide()
        }}
        testID={`item-${testID}`}
      >
        {!isDense && <HoliIcon icon={option.icon || 'global'} size={22} />}
        <View style={styles.optionTextContainer}>
          <HoliText bold>{option.title}</HoliText>
          {!isDense && option.description && <HoliText style={styles.optionDescription}>{option.description}</HoliText>}
        </View>
        <HoliCheckbox
          shape="round"
          checked={option.selected}
          autofocus={false}
          testID={`${option.selected ? 'checked-' : ''}${testID}`}
        />
      </HoliButton>
    ),
    [onChange, testID, hide, isDense, styles]
  )

  return (
    <>
      <View style={style}>
        {!!label && (
          <View style={styles.labelWrapper}>
            <HoliText size="small" bold style={styles.label}>
              {label}
            </HoliText>
            {isRequired && <Text> *</Text>}
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
              {showOptionIcon && selectedOption.icon && <HoliIcon icon={selectedOption.icon} size={24} />}
              <HoliText style={styles.selectedOptionTitle}>{selectedOption.title}</HoliText>
            </View>
          ) : (
            <HoliText style={styles.placeholder}>{placeholder}</HoliText>
          )}
          <HoliIcon icon={visible ? 'arrow-up-s' : 'arrow-down-s'} size={22} />
        </HoliButton>
      </View>

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
          <HoliHeading level="2" style={[styles.heading, isDense && styles.headingDense]}>
            {label}
          </HoliHeading>
          {!!description && <HoliText style={styles.description}>{description}</HoliText>}

          <View style={styles.optionsContainer}>{options.map(renderOption)}</View>
        </ScrollView>
      </HoliModal>
    </>
  )
}

export default HoliModalSelect

const getStyles = (isDense: boolean) =>
  StyleSheet.create({
    labelWrapper: {
      marginBottom: 6,
      flexDirection: 'row',
    },
    label: {
      color: colors.foreground30,
    },
    button: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.background10,
      color: colors.foreground30,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.background30,
    },
    buttonHovered: {
      borderColor: colors.foreground20,
    },
    placeholder: {
      color: colors.foreground20,
    },
    modal: {
      backgroundColor: isDense ? colors.background10 : colors.background30,
    },
    heading: {
      fontWeight: '400',
    },
    headingDense: {
      width: '100%',
      marginTop: 16,
      paddingBottom: 24,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.background30,
    },
    optionsContainer: {
      marginTop: isDense ? 8 : 16,
      paddingBottom: 24,
    },
    optionCard: {
      marginTop: 16,
    },
    optionCardContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: isDense ? undefined : 16,
      paddingVertical: isDense ? 12 : undefined,
      backgroundColor: colors.background10,
      borderRadius: 16,
      borderWidth: isDense ? 0 : 1,
      borderColor: colors.background30,
    },
    optionTextContainer: {
      flex: 1,
      marginTop: 2,
      paddingLeft: isDense ? 0 : 8,
      paddingRight: 8,
    },
    optionDescription: {
      marginTop: 4,
      color: colors.foreground20,
    },
    description: {
      color: colors.foreground20,
      marginTop: 8,
    },
    selectedOptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedOptionTitle: {
      marginLeft: 12,
    },
  })
