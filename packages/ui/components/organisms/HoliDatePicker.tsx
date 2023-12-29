import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeftS, ArrowRightS } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import { colors } from '@holi/ui/styles/globalVars'

LocaleConfig.locales['de'] = {
  monthNames: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
  monthNamesShort: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
  dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  dayNamesShort: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
  today: 'Heute',
}

const localizeDate = (date: Date, language: string) => {
  const currentLanguage = language

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const formattedDate = date.toLocaleDateString(currentLanguage, options)

  return formattedDate
}

export interface HoliDatePickerProps {
  onChange: (date: string) => void
  title: string
  label: string
  value?: string
  description?: string
  placeholder?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  isRequired?: boolean
  showOptionIcon?: boolean
}

const HoliDatePicker = ({
  onChange = () => null,
  title,
  label,
  value,
  placeholder,
  style,
  testID = 'holi-date-picker',
  isRequired,
}: HoliDatePickerProps) => {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  const { i18n } = useTranslation()
  const currentLanguage = (i18n.language || '').split('-')[0]
  if (currentLanguage === 'de') {
    LocaleConfig.defaultLocale = 'de'
  } else {
    LocaleConfig.defaultLocale = 'en'
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
          onPress={() => setVisible((visible) => !visible)}
          {...hoverPropsForWeb}
        >
          {value ? (
            <View style={styles.selectedDateContainer}>
              <HoliText style={styles.selectedDateTitle}>
                {localizeDate(new Date(value.replaceAll('-', '/')), currentLanguage)}
              </HoliText>
            </View>
          ) : (
            <HoliText style={styles.placeholder}>{placeholder}</HoliText>
          )}
        </HoliButton>
      </View>
      {visible && (
        <Calendar
          style={[styles.border, styles.calendar]}
          renderArrow={(direction) => <HoliIcon icon={direction === 'left' ? ArrowLeftS : ArrowRightS} />}
          onDayPress={(day) => {
            onChange(day.dateString)
            setVisible(false)
          }}
          markedDates={
            value
              ? {
                  [value]: { selected: true, disableTouchEvent: true, selectedColor: colors.brandColorB30 },
                }
              : {}
          }
        />
      )}
    </>
  )
}

export default HoliDatePicker

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
  calendar: {
    marginTop: 4,
  },
  buttonHovered: {
    borderColor: colors.foreground20,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedDateTitle: {
    marginLeft: 12,
  },
  placeholder: {
    color: colors.foreground20,
  },
})
