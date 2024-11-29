import React, { useMemo } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { User } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { SubmissionCard } from '@holi-apps/challenges/components/SubmissionCard'
import { Challenge } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'

interface ChallengeCardProps {
  challenge: Challenge
  trackingEvent: TrackingEvent
}

const cardPaddingsSum = dimensions.spacingXs * 2 + 4

export const calculateCardWidth = (screenWidth: number) => screenWidth / 1.5 - cardPaddingsSum

export const ChallengeCard = ({ challenge, trackingEvent }: ChallengeCardProps) => {
  const { theme } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const cardWidth = calculateCardWidth(screenWidth)
  const submissionCardWidth = (cardWidth - cardPaddingsSum) / 2
  const styles = useMemo(() => getStyles(theme, cardWidth), [theme, cardWidth])

  if (!challenge.submissions.length) {
    return null
  }
  const submissions = challenge.submissions.slice(0, 2)

  return (
    <View style={styles.container}>
      <HoliLinkTracked
        label={challenge.title}
        href={createInAppChallengesPath(challenge.challengeDetailPath)}
        trackingEvent={trackingEvent}
      >
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
            <HoliIcon icon={User} size={16} color={theme.colors.gray300} style={styles.participantsIcon} />
          </View>
        </View>

        <View style={styles.submissionContainer}>
          {submissions.map((submission, index) => (
            <SubmissionCard
              key={submission.id}
              challengeTitle={challenge.title}
              submission={submission}
              width={submissionCardWidth}
              trackingEvent={TrackingEvent.ChallengeCard.SubmissionPressed(challenge.id, submission.id, index)}
            />
          ))}
        </View>
      </HoliLinkTracked>
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
      flex: 1,
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
      flex: 1,
    },
  })
