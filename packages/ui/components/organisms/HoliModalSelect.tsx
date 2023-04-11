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
  placeholder?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  isRequired?: boolean
}

const HoliModalSelect: React.FC<HoliModalSelectProps> = ({
  options,
  onChange = () => null,
  title,
  label,
  placeholder,
  style,
  testID = 'holi-modal-select',
  isRequired,
}: HoliModalSelectProps) => {
  const [selectedOption, setSelectedOption] = useState<HoliModalSelectOption | undefined>()
  const [hovered, setHovered] = useState(false)

  const { show, hide, visible } = useModalState()
  const mixins = useStyleMixins()

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
        style={styles.optionCard}
        label={option.title}
        key={option.id}
        transparent
        onPress={() => onChange(option)}
        testID={`item-${testID}`}
      >
        <HoliIcon icon={option.icon || 'global'} size={22} />
        <View style={styles.optionTextContainer}>
          <HoliText bold>{option.title}</HoliText>
          <HoliText style={styles.optionDescription}>{option.description || 'hello'}</HoliText>
        </View>
        <HoliCheckbox
          shape="round"
          checked={option.selected}
          autofocus={false}
          testID={`${option.selected ? 'checked-' : ''}${testID}`}
        />
      </HoliButton>
    ),
    [onChange, testID]
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
            <HoliText>{selectedOption.title}</HoliText>
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
          <HoliHeading level="2">{label}</HoliHeading>

          <View style={styles.optionsContainer}>{options.map(renderOption)}</View>
        </ScrollView>
      </HoliModal>
    </>
  )
}

export default HoliModalSelect

const styles = StyleSheet.create({
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
    backgroundColor: colors.background30,
  },
  optionsContainer: {
    marginTop: 16,
    paddingBottom: 24,
  },
  optionCard: {
    marginTop: 16,
  },
  optionCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colors.background10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  optionTextContainer: {
    flex: 1,
    marginTop: 2,
    paddingHorizontal: 8,
  },
  optionDescription: {
    marginTop: 4,
    color: colors.foreground20,
  },
})
