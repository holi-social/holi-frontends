import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type DonationProgressProps = {
  currency: string
  currencyLocale: string
  noOfDonations: number
  donationsLabel: string
  goal: number
  total: number
  size?: 'default' | 'small'
  style?: ViewStyle | ViewStyle[]
}

const pluralize = (count: number, noun: string, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`

const DonationProgress = ({
  currency,
  currencyLocale,
  noOfDonations,
  donationsLabel,
  goal,
  total,
  size = 'default',
  ...props
}: DonationProgressProps) => {
  const styles = getStyles()
  const formatGoal = new Intl.NumberFormat(currencyLocale, {
    style: 'currency',
    currency: currency,
  }).format(1000)

  const goalPercentage = Math.round((total / goal) * 100)

  return (
    <View style={[props?.style]}>
      {size !== 'small' && (
        <HoliText>
          <HoliText size={'small'} style={{ color: colors.fontColorGrey }}>{`${pluralize(
            noOfDonations,
            'donation',
            's'
          )}`}</HoliText>
          {donationsLabel && (
            <>
              <HoliText size={'small'} style={{ color: colors.positivepurple }}>
                {' ∙ '}
              </HoliText>
              <HoliText size={'small'} style={{ color: colors.fontColorGrey }}>
                {donationsLabel}
              </HoliText>
            </>
          )}
        </HoliText>
      )}
      <View style={[styles.bar, size === 'small' && { height: 6 }]}>
        <View style={[styles.filled, size === 'small' && { height: 6 }, { width: `${goalPercentage}%` }]} />
      </View>
      <View style={styles.goals}>
        <HoliText size={'small'} style={{ color: colors.fontColorGrey }}>{`${goalPercentage}% funded`}</HoliText>
        {size !== 'small' && goal > total && <HoliText size={'small'}>{`${formatGoal} to go`}</HoliText>}
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
