import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type HoliCalendarIconSize = 'small' | 'medium'

export const HoliCalendarIconSizes: HoliCalendarIconSize[] = ['small', 'medium']

export type HoliCalendarIconProps = {
  day: number
  month: number
  disabled?: boolean
  size?: HoliCalendarIconSize
  contentStyle?: StyleProp<ViewStyle>
}

// Month and day are human readable numbers, aka 1-12 and 1-31
const HoliCalendarIcon = ({
  day,
  month,
  disabled = false,
  size = 'medium',
  ...props
}: React.PropsWithChildren<HoliCalendarIconProps>) => {
  const isSmall = size === 'small'
  const styles = useMemo(() => getStyles(isSmall, disabled), [isSmall, disabled])
  const { t } = useTranslation()

  const getMonthName = (month: number): string => {
    const monthNames: [string] = t('monthNames', { returnObjects: true })
    const monthName = monthNames[month - 1]
    if (!monthName) {
      return ''
    }
    return monthName.substring(0, 3).toUpperCase()
  }

  return (
    <View style={[props.contentStyle, styles.wrapper]}>
      <HoliBox padding={0} testID={'holi-calendar-icon'}>
        <HoliText bold style={styles.month}>
          {getMonthName(month)}
        </HoliText>
        <View style={styles.dayWrapper}>
          <HoliText style={styles.day}>{day}</HoliText>
        </View>
      </HoliBox>
    </View>
  )
}

export default HoliCalendarIcon

const getStyles = (isSmall: boolean, disabled: boolean) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      width: isSmall ? 40 : 60,
      height: isSmall ? 40 : 60,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: disabled ? colors.foreground20 : colors.foreground30,
      backgroundColor: disabled ? colors.foreground20 : colors.foreground30,
      paddingTop: 2,
    },
    month: {
      color: disabled ? colors.background30 : colors.brandColorA10,
      fontSize: isSmall ? 9 : 12,
      lineHeight: isSmall ? 9 : 12,
      paddingBottom: 2,
      textAlign: 'center',
    },
    dayWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: isSmall ? 28 : 44,
      minWidth: isSmall ? 40 : 60,
      backgroundColor: disabled ? colors.background30 : colors.brandColorA10,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    day: {
      color: disabled ? colors.foreground20 : colors.foreground30,
      fontSize: isSmall ? 20 : 28,
      ...Platform.select({
        native: {
          paddingTop: isSmall ? 0 : 8,
        },
      }),
    },
  })
