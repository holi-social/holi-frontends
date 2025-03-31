import type React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { createStyleSheet } from 'holi-bricks/utils'
import Spacing from '@holi/ui/foundations/Spacing'
import { useStyles } from 'holi-bricks/hooks'
import type { UnistylesTheme } from 'react-native-unistyles'

type HoliCalendarIconSize = 'small' | 'medium'

export const HoliCalendarIconSizes: HoliCalendarIconSize[] = ['small', 'medium']

export type HoliCalendarIconProps = {
  day: number
  month: number
  disabled?: boolean
  size?: HoliCalendarIconSize
  colored?: boolean
}

// Month and day are human readable numbers, aka 1-12 and 1-31
const HoliCalendarIcon = ({
  day,
  month,
  disabled = false,
  size = 'medium',
  colored = true,
}: React.PropsWithChildren<HoliCalendarIconProps>) => {
  const isSmall = size === 'small'
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const getMonthName = (month: number): string => {
    const monthNames = t('monthNames', { returnObjects: true }) as string[]
    const monthName = monthNames[month - 1]
    if (!monthName) {
      return ''
    }
    return monthName.substring(0, 3).toUpperCase()
  }

  return (
    <View style={styles.wrapper(isSmall, disabled)}>
      <HoliBox padding={0} testID={'holi-calendar-icon'}>
        <HoliText bold style={styles.month(isSmall, disabled, colored)}>
          {getMonthName(month)}
        </HoliText>
        <View style={styles.dayWrapper(isSmall, disabled, colored)}>
          <HoliText style={styles.day(isSmall, disabled)}>{day}</HoliText>
        </View>
      </HoliBox>
    </View>
  )
}

export default HoliCalendarIcon

const stylesheet = createStyleSheet((theme) => ({
  wrapper: (isSmall: boolean, disabled: boolean) => {
    return {
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      width: isSmall ? Spacing.xl : 60,
      height: isSmall ? Spacing.xl : 60,
      borderWidth: 1,
      borderRadius: Spacing['3xs'],
      borderColor: getDarkColor(theme, disabled),
      backgroundColor: getDarkColor(theme, disabled),
      paddingTop: 2,
    }
  },
  month: (isSmall: boolean, disabled: boolean, colored: boolean) => {
    return {
      backgroundColor: getDarkColor(theme, disabled),
      color: getLightColor(theme, disabled, colored),
      fontSize: isSmall ? 9 : Spacing.xxs,
      lineHeight: isSmall ? 9 : Spacing.xxs,
      paddingBottom: 2,
      textAlign: 'center',
    }
  },
  dayWrapper: (isSmall: boolean, disabled: boolean, colored: boolean) => {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: isSmall ? 28 : 44,
      minWidth: isSmall ? Spacing.xl : 60,
      backgroundColor: getLightColor(theme, disabled, colored),
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    }
  },
  day: (isSmall: boolean, disabled: boolean) => {
    return {
      color: getDarkColor(theme, disabled),
      fontSize: isSmall ? Spacing.sm : 28,
      ...Platform.select({
        native: {
          paddingTop: isSmall ? 0 : Spacing['3xs'],
        },
      }),
    }
  },
}))

const getLightColor = (theme: UnistylesTheme, disabled: boolean, colored: boolean) => {
  return disabled
    ? theme.colors.decorative.greyLight
    : colored
      ? theme.colors.decorative.yellowLight
      : theme.colors.decorative.white
}

const getDarkColor = (theme: UnistylesTheme, disabled: boolean) => {
  return disabled ? theme.colors.decorative.greyDark : theme.colors.decorative.black
}
