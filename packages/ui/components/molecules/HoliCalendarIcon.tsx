import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(isSmall, disabled, theme), [isSmall, disabled, theme])

  const getMonthName = (month: number): string => {
    const monthNames = t('monthNames', { returnObjects: true }) as string[]
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

const getStyles = (isSmall: boolean, disabled: boolean, theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      width: isSmall ? 40 : 60,
      height: isSmall ? 40 : 60,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: disabled || theme.dark ? theme.colors.foreground20 : theme.colors.foreground30,
      backgroundColor: disabled || theme.dark ? theme.colors.foreground20 : theme.colors.foreground30,
      paddingTop: 2,
    },
    month: {
      color: disabled || theme.dark ? theme.colors.background30 : theme.colors.brandColorA10,
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
      backgroundColor: disabled || theme.dark ? theme.colors.background30 : theme.colors.brandColorA10,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    day: {
      color: disabled || theme.dark ? theme.colors.foreground20 : theme.colors.foreground30,
      fontSize: isSmall ? 20 : 28,
      ...Platform.select({
        native: {
          paddingTop: isSmall ? 0 : 8,
        },
      }),
    },
  })
