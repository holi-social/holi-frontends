import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'
import { useTheme } from '@holi/ui/styles/theme'

interface DonationProgressProps {
  progressPercentage: number
  openAmountInCents: number
  category?: string
  size?: 'default' | 'small' | 'large'
  style?: ViewStyle | ViewStyle[]
  testID?: string
}

const DonationProgress = ({
  progressPercentage,
  openAmountInCents,
  size = 'default',
  testID,
  ...props
}: DonationProgressProps) => {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  const styles = getStyles()
  const isSmall = size === 'small'
  const goalTextSize = size === 'large' ? 'default' : 'small'
  const progressSize = size === 'small' ? 'small' : 'medium'

  const openAmount = useMemo(() => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(Math.round(openAmountInCents / 100))
  }, [openAmountInCents, i18n.language])

  return (
    <View style={[props?.style]} testID={testID}>
      <View style={styles.progressBarContainer}>
        <HoliProgressBar percentage={progressPercentage} size={progressSize} />
      </View>
      <View style={styles.goals}>
        <HoliText size={goalTextSize} bold={size === 'large'} style={{ color: colors.foreground20 }}>
          {t('donations.donationProgress.percentFunded', { percentage: progressPercentage })}
        </HoliText>
        {!isSmall && (
          <HoliText size={goalTextSize} bold>
            {t('donations.donationProgress.openAmount', { amount: openAmount })}
          </HoliText>
        )}
      </View>
    </View>
  )
}

export default DonationProgress

const getStyles = () =>
  StyleSheet.create({
    progressBarContainer: {
      paddingBottom: 8,
    },
    goals: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
