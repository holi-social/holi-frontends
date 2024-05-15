import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { User } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { SubmissionCard } from '@holi-apps/challenges/components/SubmissionCard'
import { Challenge } from '@holi-apps/challenges/components/types'
import { createChallengesPath } from '@holi-apps/challenges/helpers/navigation'

interface ChallengeCardProps {
  challenge: Challenge
}

export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const { theme } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const cardPaddingsSum = dimensions.spacingXs * 2 + 4
  const cardWidth = screenWidth / 1.5 - cardPaddingsSum
  const submissionCardWidth = (cardWidth - cardPaddingsSum) / 2
  const styles = getStyles(theme, cardWidth)

  if (!challenge.submissions.length) {
    return null
  }
  const submissions = challenge.submissions.slice(0, 2)

  return (
    <View style={styles.container}>
      <HoliLink label={challenge.title} href={createChallengesPath(challenge.challengeDetailPath)}>
        <View style={styles.headline}>
          <View style={styles.title}>
            <HoliHeading level="3" numberOfLines={1} ellipsizeMode="tail">
              {challenge.title}
            </HoliHeading>
          </View>
          <View style={styles.participantsContainer}>
            <HoliText size="extrasmall" color="gray300">
              {challenge.participants}
            </HoliText>
            <HoliIcon icon={User} size={16} color={colors.gray300} style={styles.participantsIcon} />
          </View>
        </View>

        <View style={styles.submissionContainer}>
          {submissions.map((submision) => (
            <SubmissionCard
              key={submision.id}
              challengeTitle={challenge.title}
              submission={submision}
              width={submissionCardWidth}
            />
          ))}
        </View>
      </HoliLink>
    </View>
  )
}

const getStyles = (theme: HoliTheme, cardWidth: number) =>
  StyleSheet.create({
    container: {
      width: cardWidth,
      marginRight: dimensions.spacingXs,
      flexDirection: 'column',
      padding: dimensions.spacingXs,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.gray200,
      borderRadius: 16,
      backgroundColor: theme.colors.background10,
      height: '100%',
    },
    headline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: dimensions.spacingXs,
      alignItems: 'center',
    },
    title: {
      flex: 1,
      flexGrow: 1,
    },
    participantsContainer: {
      flex: 0,
      paddingLeft: dimensions.spacingS,
      flexDirection: 'row',
    },
    participantsIcon: {
      paddingLeft: 2,
    },
    submissionContainer: {
      flexDirection: 'row',
      paddingTop: dimensions.spacingXs,
      gap: 4,
    },
  })
