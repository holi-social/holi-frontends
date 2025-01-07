import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { formatDateToYYYMMDD, getDateObjFromYYYMMDD, localizeDate } from '@holi/ui/helper/date'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import type { HoliDatePickerProps } from './types'

const HoliDatePicker = ({
  value,
  onChange,
  title,
  label,
  style,
  minimumDate,
  maximumDate,
  isRequired,
  testID = 'holi-date-picker',
}: HoliDatePickerProps) => {
  const [showPickerIOS, setShowPickerIOS] = useState(false)
  const { i18n } = useTranslation()
  const currentLanguage = getLocale(i18n.language || '')
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const onChangeDate = (event: DateTimePickerEvent) => {
    onChange(new Date(event.nativeEvent.timestamp || 0))
  }

  const showPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(value),
        onChange: onChangeDate,
        mode: 'date',
        display: 'calendar',
      })
    } else {
      setShowPickerIOS(true)
    }
  }

  const displayValue = value && localizeDate(getDateObjFromYYYMMDD(formatDateToYYYMMDD(value)), currentLanguage)

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
          contentStyle={[styles.border, styles.button]}
          onPress={showPicker}
        >
          <View style={styles.selectedDateContainer}>
            <HoliText ellipsizeMode="tail" numberOfLines={1} style={styles.selectedDateTitle}>
              {displayValue}
            </HoliText>
          </View>
        </HoliButton>
      </View>
      {Platform.OS === 'ios' && (
        <HoliModal
          show={showPickerIOS}
          label={title}
          autoHeight
          onDismiss={() => setShowPickerIOS(false)}
          style={styles.modal}
        >
          <DateTimePicker
            value={value}
            onChange={onChangeDate}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            mode="date"
            is24Hour={true}
            locale={currentLanguage}
            display="spinner"
            textColor={colors.foreground30}
            testID={testID}
          />
        </HoliModal>
      )}
    </>
  )
}

export default HoliDatePicker

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
    selectedDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedDateTitle: {
      marginLeft: 12,
    },
    modal: {
      paddingBottom: 42,
    },
  })
