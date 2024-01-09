import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { isWeb } from '@holi/chat/src/utils'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface HoliTimePickerProps {
  onChangeHours: (hours: string) => void
  onChangeMinutes: (minutes: string) => void
  valueHours?: string
  valueMinutes?: string
  title: string
  label?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  isRequired?: boolean
}

const HoliTimePicker = ({
  onChangeHours,
  onChangeMinutes,
  valueHours,
  valueMinutes,
  title,
  label,
  style,
  testID = 'holi-time-picker',
  isRequired,
}: HoliTimePickerProps) => {
  const [hovered, setHovered] = useState(false)
  const { show: showModal, hide: hideModal, props: modalProps } = useModalState()
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const hoursLabel = t('global.hours')
  const minutesLabel = t('global.minutes')

  const onModalClose = () => {
    if (!valueHours) onChangeHours('00')
    if (!valueMinutes) onChangeMinutes('00')
    hideModal()
  }

  const hoverPropsForWeb = Platform.select({
    web: {
      onMouseEnter: () => setHovered(true),
      onMouseOut: () => setHovered(false),
    },
  })

  return (
    <>
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
          contentStyle={[styles.border, styles.button, hovered && styles.buttonHovered]}
          onPress={modalProps?.show ? hideModal : showModal}
          {...hoverPropsForWeb}
        >
          {valueHours ? (
            <View style={styles.valueContainer}>
              <HoliText style={styles.value}>
                {valueHours}:{valueMinutes}
              </HoliText>
            </View>
          ) : (
            <HoliText style={styles.placeholder}>00:00</HoliText>
          )}
        </HoliButton>
      </View>
      <HoliModal
        label={label || ''}
        {...modalProps}
        autoHeight={false}
        relativeHeight={1}
        onDismiss={onModalClose}
        style={[mixins.container, styles.modal]}
      >
        <View style={styles.inputContainer}>
          <HoliTextInput
            value={valueHours}
            onChange={(text) => Number(text) < 24 && onChangeHours(text.replace(/[^0-9+ .]/g, ''))}
            placeholder="00"
            inputLabel={hoursLabel}
            aria-label={hoursLabel}
            inline={!isWeb}
            type="number"
            inputProps={{
              keyboardType: 'number-pad',
              inputMode: 'numeric',
              maxLength: 2,
              autoFocus: true,
            }}
            style={styles.input}
          />
          <HoliTextInput
            value={valueMinutes}
            onChange={(text) => Number(text) < 60 && onChangeMinutes(text.replace(/[^0-9+ .]/g, ''))}
            placeholder="00"
            inputLabel={minutesLabel}
            aria-label={minutesLabel}
            inline={!isWeb}
            type="number"
            inputProps={{
              keyboardType: 'number-pad',
              inputMode: 'numeric',
              maxLength: 2,
            }}
            style={styles.input}
          />
        </View>
      </HoliModal>
    </>
  )
}

export default HoliTimePicker

const styles = StyleSheet.create({
  labelWrapper: {
    marginBottom: 6,
    flexDirection: 'row',
  },
  label: {
    color: colors.foreground30,
  },
  border: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.background30,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background10,
    color: colors.foreground30,
  },
  buttonHovered: {
    borderColor: colors.foreground20,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    marginLeft: 12,
  },
  placeholder: {
    color: colors.foreground20,
  },
  modal: {
    backgroundColor: colors.background30,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
})
