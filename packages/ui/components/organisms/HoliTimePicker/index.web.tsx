import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { getFormattedTimePart } from './helpers'
import type { HoliTimePickerProps } from './types'

const HoliTimePicker = ({
  value,
  onChange,
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

  const [hours, setHours] = useState(value.getHours().toString())
  const [minutes, setMinutes] = useState(value.getMinutes().toString())

  const hoursLabel = t('global.hours')
  const minutesLabel = t('global.minutes')

  const hoverPropsForWeb = Platform.select({
    web: {
      onMouseEnter: () => setHovered(true),
      onMouseOut: () => setHovered(false),
    },
  })

  const onDismiss = () => {
    const newValue = new Date(value)
    // update hours and minutes only if they are valid
    !isNaN(parseInt(hours)) && newValue.setHours(parseInt(hours))
    !isNaN(parseInt(minutes)) && newValue.setMinutes(parseInt(minutes))

    // Modal content does not get destroyed when it is hidden
    // So, we need to reset the values with the 'newValue'
    setHours(newValue.getHours().toString())
    setMinutes(newValue.getMinutes().toString())

    onChange(newValue)
    hideModal()
  }

  const onHoursChange = (value: string) => {
    const formattedValue = value.replace(/[^0-9+ .]/g, '')
    const hours = parseInt(formattedValue)

    // 'hours' is NaN when 'formattedValue' is an empty string
    if (isNaN(hours) || hours < 0 || hours > 23) {
      setHours(formattedValue.slice(0, -1))
    } else {
      setHours(formattedValue)
    }
  }

  const onMinutesChange = (value: string) => {
    const formattedValue = value.replace(/[^0-9+ .]/g, '')
    const minutes = parseInt(formattedValue)

    // 'minutes' is NaN when 'formattedValue' is an empty string
    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
      setMinutes(formattedValue.slice(0, -1))
    } else {
      setMinutes(formattedValue)
    }
  }

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
          onPress={modalProps?.shown ? hideModal : showModal}
          {...hoverPropsForWeb}
        >
          {value ? (
            <View style={styles.valueContainer}>
              <HoliText>
                {getFormattedTimePart(value.getHours())}:{getFormattedTimePart(value.getMinutes())}
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
        onDismiss={onDismiss}
        style={styles.modal}
      >
        <View style={[mixins.container, styles.inputContainer]}>
          <HoliTextInput
            value={hours}
            onChange={onHoursChange}
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
            value={minutes}
            onChange={onMinutesChange}
            placeholder="00"
            inputLabel={minutesLabel}
            aria-label={minutesLabel}
            type="number"
            inputProps={{
              keyboardType: 'number-pad',
              inputMode: 'numeric',
              maxLength: 2,
              onSubmitEditing: onDismiss,
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
