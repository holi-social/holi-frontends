import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliProgressBar, { useProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'
import { colors } from '@holi/ui/styles/globalVars'

type DonationProgressProps = {
  progressPercentage: number
  openAmountInCents: number
  category?: string
  size?: 'default' | 'small' | 'large'
  style?: ViewStyle | ViewStyle[]
}

const DonationProgress = ({
  progressPercentage,
  openAmountInCents,
  size = 'default',
  ...props
}: DonationProgressProps) => {
  const { t, i18n } = useTranslation()
  const styles = getStyles()
  const isSmall = size === 'small'
  const goalTextSize = size === 'large' ? 'default' : 'small'
  const progressVariant = size === 'small' ? 'small' : 'default'

  const openAmount = useMemo(() => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(Math.round(openAmountInCents / 100))
  }, [openAmountInCents, i18n.language])
  const { progressWidth } = useProgressBar(progressPercentage)

  return (
    <View style={[props?.style]}>
      <View style={styles.goals}>
        <HoliText size={goalTextSize} bold={size === 'large'} style={{ color: colors.foreground20 }}>
          {t('donations:donationProgress.percentFunded', { percentage: progressPercentage })}
        </HoliText>
        {!isSmall && (
          <HoliText size={goalTextSize} bold>
            {t('donations:donationProgress.openAmount', { amount: openAmount })}
          </HoliText>
        )}
      </View>
      <View style={styles.progressBarContainer}>
        <HoliProgressBar width={progressWidth} variant={progressVariant} />
      </View>
    </View>
  )
}

export default DonationProgress

const getStyles = () =>
  StyleSheet.create({
    progressBarContainer: {
      marginTop: 8,
    },
    goals: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
