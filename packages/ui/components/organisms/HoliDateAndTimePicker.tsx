import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliDatePicker from '@holi/ui/components/organisms/HoliDatePicker'
import type { HoliDatePickerBaseProps } from '@holi/ui/components/organisms/HoliDatePicker/types'
import HoliTimePicker from '@holi/ui/components/organisms/HoliTimePicker'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props extends HoliDatePickerBaseProps {
  title: string
}

const HoliDateAndTimePicker = ({
  value,
  onChange,
  title,
  label,
  style,
  isRequired,
  minimumDate,
  maximumDate,
  testID = 'holi-date-and-time-picker',
}: Props) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const onTimeChange = (change: Date) => {
    const newValue = new Date(value)

    newValue.setHours(change.getHours())
    newValue.setMinutes(change.getMinutes())

    onChange(newValue)
  }

  const onDateChange = (change: Date) => {
    const newValue = new Date(value)

    newValue.setFullYear(change.getFullYear())
    newValue.setMonth(change.getMonth())
    newValue.setDate(change.getDate())

    onChange(newValue)
  }

  return (
    <View style={style} testID={testID}>
      {!!label && (
        <View style={styles.labelWrapper}>
          <HoliText size="small" bold style={styles.label}>
            {label}
            <HoliMandatoryFieldStar show={!!isRequired} />
          </HoliText>
        </View>
      )}
      <View style={styles.inputWrapper}>
        <View style={styles.dateInput}>
          <HoliDatePicker
            value={value}
            onChange={onDateChange}
            title={title}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            isRequired={isRequired}
          />
        </View>

        <View>
          <HoliTimePicker value={value} onChange={onTimeChange} />
        </View>
      </View>
    </View>
  )
}

export default HoliDateAndTimePicker

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    labelWrapper: {
      marginBottom: 6,
      flexDirection: 'row',
    },
    label: {
      color: theme.colors.foreground30,
    },
    inputWrapper: {
      flexDirection: 'row',
    },
    dateInput: {
      flex: 1,
    },
  })
