import React, { useCallback, useMemo } from 'react'
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

// TODO(konrad): refactor and move to collection of helpers later?
const pluralize = (count: number, noun: string, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`

const DonationProgress = ({
  donationsCount,
  progressPercentage,
  openAmountInCents,
  category,
  size = 'default',
  ...props
}: DonationProgressProps) => {
  const styles = getStyles()
  const isSmall = size === 'small'
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
        <HoliText size="small" style={{ color: colors.fontColorGrey }}>
          {`${pluralize(donationsCount, 'donation', 's')}`}
        </HoliText>
        {category && (
          <>
            <HoliText size="small" style={{ color: colors.positivepurple }}>
              {' ∙ '}
            </HoliText>
            <HoliText size="small" style={{ color: colors.fontColorGrey }}>
              {category}
            </HoliText>
          </>
        )}
      </HoliText>
    ),
    [donationsCount, category]
  )

  return (
    <View style={[props?.style]}>
      {size !== 'small' && interactionBar()}
      <View style={[styles.bar, isSmall && { height: 6 }]}>
        <View style={[styles.filled, isSmall && { height: 6 }, { width: `${progressPercentage}%` }]} />
      </View>
      <View style={styles.goals}>
        <HoliText size="small" style={{ color: colors.fontColorGrey }}>{`${progressPercentage}% funded`}</HoliText>
        {!isSmall && <HoliText size="small" style={styles.openAmount}>{`${openAmount} to go`}</HoliText>}
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
