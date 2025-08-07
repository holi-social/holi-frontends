import React, { useMemo, useState, useCallback } from 'react'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { User } from '@holi/icons/src/generated'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { SubmissionCard } from '@holi-apps/challenges/components/SubmissionCard'
import type { Challenge } from '@holi-apps/challenges/components/types'
import { appendShowPromo, createInAppChallengesPath, setHasSeen } from '@holi-apps/challenges/helpers/navigation'
import { Spacing } from 'holi-bricks/foundations'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'

interface ChallengeCardProps {
  challenge: Challenge
  trackingEvent: TrackingEvent
}

const cardPaddingsSum = Spacing['3xs'] * 2 + 4

export const calculateCardWidth = (screenWidth: number) => screenWidth / 1.5 - cardPaddingsSum

export const ChallengeCard = ({ challenge, trackingEvent }: ChallengeCardProps) => {
  const { theme } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const cardWidth = calculateCardWidth(Platform.OS === 'web' ? 500 : screenWidth)
  const submissionCardWidth = (cardWidth - cardPaddingsSum) / 2
  const styles = useMemo(() => getStyles(theme, cardWidth), [theme, cardWidth])
  const [detailUrl, setDetailUrl] = useState('')
  const submissions = challenge.submissions.slice(0, 2)

  const updatePromoState = useCallback(async () => {
    const url = await appendShowPromo(`/challenges/${challenge.id}`, challenge.id)
    setDetailUrl(url)
  }, [challenge.id])

  useFocusEffect(
    useCallback(() => {
      updatePromoState()
    }, [updatePromoState])
  )

  if (!challenge.submissions.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <HoliLinkTracked
        label={challenge.title}
        href={createInAppChallengesPath(detailUrl)}
        trackingEvent={trackingEvent}
        onPress={() => {
          setHasSeen(challenge.id)
        }}
      >
        <HoliGap size="xxs" />
        <View style={styles.headline}>
          <View style={styles.title}>
            <Text size="lg" numberOfLines={2} ellipsizeMode="tail">
              {challenge.title}
            </Text>
          </View>
          <View style={styles.participantsContainer}>
            <Text size="xs" color="support">
              {challenge.participants}
            </Text>

            <HoliIcon icon={User} size={14} color="support" style={styles.participantsIcon} />
          </View>
        </View>

        <View style={styles.submissionContainer}>
          {submissions.map((submission, index) => (
            <SubmissionCard
              key={submission.id}
              challengeTitle={challenge.title}
              submission={submission}
              width={submissionCardWidth}
              trackingEvent={TrackingEvent.ChallengeCard.SubmissionPressed(
                challenge.id,
                challenge.title,
                submission.id,
                index,
                'act'
              )}
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
      flexDirection: 'column',
      padding: Spacing['3xs'],
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.gray200,
      borderRadius: 16,
      backgroundColor: theme.colors.background10,
    },
    headline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing['3xs'],
      paddingBottom: Spacing['4xs'],
      minHeight: 50,
      alignItems: 'flex-start',
    },
    title: {
      flex: 1,
      flexGrow: 1,
      maxWidth: '75%',
    },
    participantsContainer: {
      paddingLeft: Spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: Spacing['4xs'],
    },
    participantsIcon: {
      paddingLeft: 2,
    },
    submissionContainer: {
      paddingTop: Spacing['3xs'],
      flexDirection: 'row',
      gap: Spacing['4xs'],
    },
  })
