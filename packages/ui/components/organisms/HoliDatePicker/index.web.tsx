import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'
import { Calendar, type DateData, LocaleConfig } from 'react-native-calendars'

import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeftS, ArrowRightS } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import { formatDateToYYYMMDD, localizeDate } from '@holi/ui/helper/date'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import type { HoliDatePickerProps } from './types'

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

const HoliDatePicker = ({
  onChange = () => null,
  title,
  value,
  label,
  style,
  minimumDate,
  maximumDate,
  isRequired,
  dateFormat = 'long',
  testID = 'holi-date-picker',
}: HoliDatePickerProps) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  const { i18n } = useTranslation()
  const currentLanguage = getLocale(i18n.language || '')

  const displayValue =
    value &&
    localizeDate(
      value,
      currentLanguage,
      dateFormat === 'short'
        ? {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }
        : undefined
    )

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
          <View style={styles.selectedDateContainer}>
            <HoliText ellipsizeMode="tail" numberOfLines={1} style={styles.selectedDateTitle}>
              {displayValue}
            </HoliText>
          </View>
        </HoliButton>
      </View>

      {visible && (
        <Calendar
          style={[styles.border, styles.calendar]}
          renderArrow={(direction: 'left' | 'right') => (
            <HoliIcon icon={direction === 'left' ? ArrowLeftS : ArrowRightS} />
          )}
          onDayPress={(day: DateData) => {
            onChange(new Date(day.timestamp))
            setVisible(false)
          }}
          markedDates={
            value
              ? {
                  [formatDateToYYYMMDD(value)]: {
                    selected: true,
                    disableTouchEvent: false,
                    selectedColor: colors.brandColorB30,
                  },
                }
              : {}
          }
          minDate={minimumDate ? formatDateToYYYMMDD(minimumDate) : undefined}
          maxDate={maximumDate ? formatDateToYYYMMDD(maximumDate) : undefined}
          testID={testID}
        />
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
    calendar: {
      marginTop: 4,
    },
    buttonHovered: {
      borderColor: theme.colors.foreground20,
    },
    selectedDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedDateTitle: {
      marginLeft: 12,
    },
  })
