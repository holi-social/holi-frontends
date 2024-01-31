import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { numberToStringWithPad } from '@holi/ui/helper/date'
import { colors } from '@holi/ui/styles/globalVars'

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
  const [showPickerIOS, setShowPickerIOS] = useState(false)
  const { t } = useTranslation()

  // the datetimepicker package works with timestamps and thus we create a date and ignore the month, day and year later
  const date = new Date()
  date.setHours(+(valueHours || 0))
  date.setMinutes(+(valueMinutes || 0))

  const onPickerClose = () => {
    if (!valueHours) onChangeHours('00')
    if (!valueMinutes) onChangeMinutes('00')
  }

  const onChange = (event: DateTimePickerEvent) => {
    const chosenDate = new Date(event.nativeEvent.timestamp || 0)
    onChangeHours(numberToStringWithPad(chosenDate.getHours()) + '')
    onChangeMinutes(numberToStringWithPad(chosenDate.getMinutes()) + '')
  }

  const showPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date, // YYYY-MM-DDTHH:mm:ss.sssZ
        onChange,
        mode: 'time',
        is24Hour: true,
        display: 'spinner',
      })
    } else {
      setShowPickerIOS(true)
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
      {Platform.OS === 'ios' && (
        <HoliModal
          show={showPickerIOS}
          label={t('global.time')}
          autoHeight
          onDismiss={() => {
            setShowPickerIOS(false)
            onPickerClose()
          }}
          style={styles.modal}
        >
          <DateTimePicker
            testID={testID}
            value={date}
            mode="time"
            is24Hour={true}
            onChange={onChange}
            locale="de_DE" // necessary in order to force military time (not AM/PM)
            display="spinner"
          />
        </HoliModal>
      )}
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
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
  },
  placeholder: {
    color: colors.foreground20,
  },
  modal: {
    paddingBottom: 42,
  },
})
