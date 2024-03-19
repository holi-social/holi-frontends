import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { numberToStringWithPad } from '@holi/ui/helper/date'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface HoliTimePickerProps {
  onChangeHours: (hours: string) => void
  onChangeMinutes: (minutes: string) => void
  valueHours?: string
  valueMinutes?: string
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
  label,
  style,
  testID = 'holi-time-picker',
  isRequired,
}: HoliTimePickerProps) => {
  const [hovered, setHovered] = useState(false)
  const { show: showModal, hide: hideModal, props: modalProps } = useModalState()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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
          label={t('global.time')}
          testID={`btn-${testID}`}
          transparent
          contentStyle={[styles.border, styles.button, hovered && styles.buttonHovered]}
          onPress={modalProps?.show ? hideModal : showModal}
          {...hoverPropsForWeb}
        >
          {valueHours ? (
            <View style={styles.valueContainer}>
              <HoliText>
                {valueHours}:{valueMinutes}
              </HoliText>
            </View>
          ) : (
            <HoliText style={styles.placeholder}>{t('global.time.placeholder')}</HoliText>
          )}
        </HoliButton>
      </View>
      <HoliModal
        label={label || ''}
        {...modalProps}
        autoHeight={false}
        relativeHeight={1}
        onDismiss={() => {
          onChangeHours(numberToStringWithPad(+(valueHours || 0)))
          onChangeMinutes(numberToStringWithPad(+(valueMinutes || 0)))
          onModalClose()
        }}
        style={styles.modal}
      >
        <View style={[mixins.container, styles.inputContainer]}>
          <HoliTextInput
            value={valueHours}
            onChange={(text) => Number(text) < 24 && onChangeHours(text.replace(/[^0-9+ .]/g, ''))}
            placeholder="00"
            inputLabel={hoursLabel}
            aria-label={hoursLabel}
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
            type="number"
            inputProps={{
              keyboardType: 'number-pad',
              inputMode: 'numeric',
              maxLength: 2,
              onSubmitEditing: hideModal,
              returnKeyType: 'done',
            }}
            style={styles.input}
          />
        </View>
      </HoliModal>
    </>
  )
}

export default HoliTimePicker

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    labelWrapper: {
      marginBottom: 6,
      flexDirection: 'row',
    },
    label: {
      color: theme.colors.foreground30,
    },
    border: {
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.background30,
    },
    button: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background10,
      color: theme.colors.foreground30,
    },
    buttonHovered: {
      borderColor: theme.colors.foreground20,
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'center',
    },
    placeholder: {
      color: theme.colors.foreground20,
    },
    modal: {
      backgroundColor: theme.colors.background30,
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
