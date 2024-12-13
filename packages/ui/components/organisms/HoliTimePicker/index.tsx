import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  const [iOSPickerShown, setIOSPickerShown] = useState(false)

  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const onChangeEvent = (event: DateTimePickerEvent) => {
    const chosenDate = new Date(event.nativeEvent.timestamp || 0)
    onChange(chosenDate)
  }

  const showPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value, // YYYY-MM-DDTHH:mm:ss.sssZ
        onChange: onChangeEvent,
        mode: 'time',
        is24Hour: true,
        display: 'clock',
      })
    } else {
      setIOSPickerShown(true)
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
          contentStyle={[styles.border, styles.button]}
          onPress={showPicker}
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

      {Platform.OS === 'ios' && (
        <HoliModal
          shown={iOSPickerShown}
          label={t('global.time')}
          autoHeight
          onDismiss={() => {
            setIOSPickerShown(false)
          }}
          style={styles.modal}
        >
          <DateTimePicker
            testID={testID}
            value={value}
            mode="time"
            is24Hour={true}
            onChange={onChangeEvent}
            locale="de_DE" // necessary in order to force military time (not AM/PM)
            display="spinner"
            textColor={colors.foreground30}
          />
        </HoliModal>
      )}
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
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'center',
    },
    placeholder: {
      color: theme.colors.foreground20,
    },
    modal: {
      paddingBottom: 42,
    },
  })
