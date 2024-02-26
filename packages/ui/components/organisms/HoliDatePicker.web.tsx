import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeftS, ArrowRightS } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import { getDateObjFromYYYMMDD, localizeDate } from '@holi/ui/helper/date'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
export interface HoliDatePickerProps {
  onChange: (date: string) => void
  title: string
  value: string
  label?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  isRequired?: boolean
}

const HoliDatePicker = ({
  onChange = () => null,
  title,
  value,
  label,
  style,
  testID = 'holi-date-picker',
  isRequired,
}: HoliDatePickerProps) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  const { i18n } = useTranslation()
  const currentLanguage = getLocale(i18n.language || '')

  const displayValue = value && localizeDate(getDateObjFromYYYMMDD(value), currentLanguage)

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
