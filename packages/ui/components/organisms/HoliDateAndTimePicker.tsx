import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliDatePicker from '@holi/ui/components/organisms/HoliDatePicker'
import HoliTimePicker from '@holi/ui/components/organisms/HoliTimePicker'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliDateAndTimePickerProps {
  onChangeDate: (hours: string) => void
  onChangeHours: (hours: string) => void
  onChangeMinutes: (minutes: string) => void
  valueDate: string
  valueHours?: string
  valueMinutes?: string
  title: string
  label: string
  style?: StyleProp<ViewStyle>
  isRequired?: boolean
  testID?: string
}

const HoliDateAndTimePicker = ({
  onChangeDate,
  onChangeHours,
  onChangeMinutes,
  valueDate,
  valueHours,
  valueMinutes,
  title,
  label,
  style,
  isRequired,
  testID = 'holi-date-and-time-picker',
}: HoliDateAndTimePickerProps) => {
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
          <HoliDatePicker onChange={onChangeDate} title={title} value={valueDate} isRequired={isRequired} />
        </View>
        <View>
          <HoliTimePicker
            valueHours={valueHours}
            onChangeHours={onChangeHours}
            valueMinutes={valueMinutes}
            onChangeMinutes={onChangeMinutes}
          />
        </View>
      </View>
    </View>
  )
}

export default HoliDateAndTimePicker

const styles = StyleSheet.create({
  labelWrapper: {
    marginBottom: 6,
    flexDirection: 'row',
  },
  label: {
    color: colors.foreground30,
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  dateInput: {
    flex: 1,
  },
})
