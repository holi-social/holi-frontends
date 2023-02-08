import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliProgressBar from '@holi/ui/components/molecules/HoliProgressBar'
import { colors } from '@holi/ui/styles/globalVars'

type DonationProgressProps = {
  donationsCount: number
  progressPercentage: number
  openAmountInCents: number
  category?: string
  size?: 'default' | 'small' | 'large'
  style?: ViewStyle | ViewStyle[]
}

const DonationProgress = ({
  donationsCount,
  progressPercentage,
  openAmountInCents,
  category,
  size = 'default',
  ...props
}: DonationProgressProps) => {
  const { t, i18n } = useTranslation()
  const styles = getStyles()
  const isSmall = size === 'small'
  const goalTextSize = size === 'large' ? 'default' : 'small'

  const openAmount = useMemo(() => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(Math.round(openAmountInCents / 100))
  }, [openAmountInCents, i18n.language])

  const interactionBar = useCallback(
    () => (
      <HoliText>
        <HoliText size="small" style={{ color: colors.fontColorGrey }}>
          {t('donations:donationProgress.count', { count: donationsCount })}
        </HoliText>
        {category && (
          <>
            <HoliText size="small" style={{ color: colors.brandColorB30 }}>
              {' ∙ '}
            </HoliText>
            <HoliText size="small" style={{ color: colors.fontColorGrey }}>
              {t(`donations:category.${category}`)}
            </HoliText>
          </>
        )}
      </HoliText>
    ),
    [t, donationsCount, category]
  )

  return (
    <View style={[props?.style]}>
      {size !== 'small' && interactionBar()}
      <View style={styles.progressBarContainer}>
        <HoliProgressBar progress={progressPercentage} isSmall={isSmall} />
      </View>
      <View style={styles.goals}>
        <HoliText size={goalTextSize} bold={size === 'large'} style={{ color: colors.fontColorGrey }}>
          {t('donations:donationProgress.percentFunded', { percentage: progressPercentage })}
        </HoliText>
        {!isSmall && (
          <HoliText size={goalTextSize} bold>
            {t('donations:donationProgress.openAmount', { amount: openAmount })}
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
      marginVertical: 8,
    },
    goals: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
