import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Text } from 'holi-bricks/components/text'

import { CarouselImage } from '@holi-apps/challenges/components/feed/CarouselImage'
import type { Challenge } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { Spacing } from 'holi-bricks/tokens/dimensions/spacing'

interface ChallengesCarouselCardProps {
  challenge: Challenge
  trackingEvent: TrackingEvent
}

const cardPaddingsSum = dimensions.spacingXs * 2 + 4

export const calculateCardWidth = (screenWidth: number) => screenWidth / 1.5 - cardPaddingsSum

export const ChallengesCarouselCard = ({ challenge, trackingEvent }: ChallengesCarouselCardProps) => {
  const cardWidth = 130
  const styles = useMemo(() => getStyles(cardWidth), [cardWidth])

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
        <View style={styles.imageContainer}>
          {submissions.slice(0, 1).map((submission, index) => (
            <CarouselImage
              key={submission.id}
              challengeTitle={challenge.title}
              challenge={submission}
              width={cardWidth}
              trackingEvent={TrackingEvent.ChallengeCard.SubmissionPressed(challenge.id, submission.id, index)}
              participants={challenge.participants}
            />
          ))}
        </View>
        <View style={styles.headline}>
          <View style={styles.title}>
            <Text size={'lg'}>{challenge.title}</Text>
          </View>
        </View>
      </HoliLinkTracked>
    </View>
  )
}

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    container: {
      width: cardWidth,
      marginRight: Spacing['3xs'],
      flexDirection: 'column',
      borderRadius: 16,
      height: '100%',
    },
    headline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: Spacing['3xs'],
      alignItems: 'center',
    },
    title: {
      flex: 1,
      flexGrow: 1,
    },
    imageContainer: {
      flexDirection: 'row',
      paddingTop: Spacing['3xs'],
      gap: 4,
      flex: 1,
    },
  })
