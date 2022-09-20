import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type DonationProgressProps = {
  donationsCount: number
  progressPercentage: number
  openAmountInCents: number
  category: string
  size?: 'default' | 'small'
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
            <HoliText size="small" style={{ color: colors.positivepurple }}>
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
      <View style={[styles.bar, isSmall && { height: 6 }]}>
        <View style={[styles.filled, isSmall && { height: 6 }, { width: `${progressPercentage}%` }]} />
      </View>
      <View style={styles.goals}>
        <HoliText size="small" style={{ color: colors.fontColorGrey }}>
          {t('donations:donationProgress.percentFunded', { percentage: progressPercentage })}
        </HoliText>
        {!isSmall && (
          <HoliText size="small" style={styles.openAmount}>
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
    bar: {
      backgroundColor: colors.backgroundColorGreyDark,
      height: 12,
      borderRadius: 6,
      width: '100%',
      marginVertical: 8,
    },
    filled: {
      borderColor: colors.borderColor,
      borderWidth: 1,
      borderRadius: 6,
      minWidth: 12,
      height: 12,
      backgroundColor: colors.backgroundColorDonationGreen,
      maxWidth: '100%',
    },
    goals: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    openAmount: {
      fontWeight: '500',
    },
  })
