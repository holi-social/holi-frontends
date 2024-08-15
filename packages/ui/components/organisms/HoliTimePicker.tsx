import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const assembleDate = (hours?: string, minutes?: string) => {
    const date = new Date()
    date.setHours(Number(hours ?? 0))
    date.setMinutes(Number(minutes ?? 0))

    return date
  }

  // the datetimepicker package works with timestamps and thus we create a date and ignore the month, day and year later
  const date = assembleDate(valueHours, valueMinutes)

  const [newValueIOS, setNewValueIOS] = useState<Date>(date)

  useEffect(() => {
    setNewValueIOS(assembleDate(valueHours, valueMinutes))
  }, [valueHours, valueMinutes])

  const onChange = (chosenDate: Date) => {
    onChangeHours(chosenDate.getHours().toString().padStart(2, '0'))
    onChangeMinutes(chosenDate.getMinutes().toString().padStart(2, '0'))
  }

  const onChangeEvent = (event: DateTimePickerEvent) => {
    const chosenDate = new Date(event.nativeEvent.timestamp || 0)
    onChange(chosenDate)
  }

  const showPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date, // YYYY-MM-DDTHH:mm:ss.sssZ
        onChange: onChangeEvent,
        mode: 'time',
        is24Hour: true,
        display: 'clock',
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
            if (!newValueIOS) return
            onChange(newValueIOS)
          }}
          style={styles.modal}
        >
          <DateTimePicker
            testID={testID}
            value={newValueIOS}
            mode="time"
            is24Hour={true}
            onChange={(event) =>
              event.nativeEvent?.timestamp && setNewValueIOS(new Date(event.nativeEvent.timestamp ?? 0))
            }
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
