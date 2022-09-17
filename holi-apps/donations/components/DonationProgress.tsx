import React, { useCallback, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type DonationProgressProps = {
  donationsCount: number
  progressPercentage: number
  openAmountInCents: number
  category?: string
  size?: 'default' | 'small'
  bold?: boolean
  hideDonationsCount?: boolean
  style?: ViewStyle | ViewStyle[]
}

const DonationProgress = ({
  donationsCount,
  progressPercentage,
  openAmountInCents,
  category,
  bold,
  hideDonationsCount = false,
  size = 'default',
  ...props
}: DonationProgressProps) => {
  const { t } = useTranslation()
  const styles = getStyles()
  const openAmount = useMemo(() => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(Math.round(openAmountInCents / 100))
  }, [openAmountInCents])

  // TODO(konrad): move this to separate component later (with avatar bubbles and likes)
  const interactionBar = useCallback(
    () => (
      <HoliText>
        {!hideDonationsCount && (
          <HoliText size={bold ? 'default' : 'small'} bold={bold} style={{ color: colors.fontColorGrey }}>
            <Trans t={t} i18nKey="apps.donations.label" values={{ count: donationsCount }} />
          </HoliText>
        )}
        {category && (
          <>
            {!hideDonationsCount && (
              <HoliText size={bold ? 'default' : 'small'} bold={bold} style={{ color: colors.positivepurple }}>
                {' ∙ '}
              </HoliText>
            )}
            <HoliText size={bold ? 'default' : 'small'} bold={bold} style={{ color: colors.fontColorGrey }}>
              {category}
            </HoliText>
          </>
        )}
      </HoliText>
    ),
    [hideDonationsCount, bold, t, donationsCount, category]
  )

  return (
    <View style={[props?.style]}>
      {size !== 'small' && interactionBar()}
      <View style={[styles.bar, size === 'small' && { height: 6 }]}>
        <View style={[styles.filled, size === 'small' && { height: 6 }, { width: `${progressPercentage}%` }]} />
      </View>
      <View style={styles.goals}>
        <HoliText
          size={bold ? 'default' : 'small'}
          style={{ color: colors.fontColorGrey }}
          bold={bold}
        >{`${progressPercentage}% funded`}</HoliText>
        {size !== 'small' && <HoliText size={bold ? 'default' : 'small'} bold={bold}>{`${openAmount} to go`}</HoliText>}
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
  })
