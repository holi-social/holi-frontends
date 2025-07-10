import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import type { TrackingEvent } from '@holi/core/tracking'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Text } from 'holi-bricks/components/text'

import { CarouselCardImage } from '@holi-apps/challenges/components/feed/CarouselCardImage'
import type { ChallengeTeaser } from '@holi-apps/challenges/components/types'
import { appendShowPromo, createInAppChallengesPath, setHasSeen } from '@holi-apps/challenges/helpers/navigation'
import { Spacing } from 'holi-bricks/foundations/dimensions/spacing'

interface ChallengesCarouselCardProps {
  challenge: ChallengeTeaser
  trackingEvent: TrackingEvent
  cardWidth: number
}

const cardPaddingsSum = dimensions.spacingXs * 2 + 4

export const calculateCardWidth = (screenWidth: number) => screenWidth / 1.5 - cardPaddingsSum

export const ChallengesCarouselCard = ({ challenge, trackingEvent, cardWidth }: ChallengesCarouselCardProps) => {
  const styles = useMemo(() => getStyles(cardWidth), [cardWidth])
  const [detailUrl, setDetailUrl] = useState('')

  useEffect(() => {
    const initUrl = async () => {
      const url = await appendShowPromo(`/challenges/${challenge.id}`)
      setDetailUrl(url)
    }
    initUrl()
  }, [challenge.id])

  return (
    <View style={styles.container}>
      <HoliLinkTracked
        label={challenge.title}
        href={createInAppChallengesPath(detailUrl)}
        trackingEvent={trackingEvent}
        onPress={() => {
          setHasSeen()
        }}
      >
        <View style={styles.imageContainer}>
          <CarouselCardImage key={challenge.id} challenge={challenge} width={cardWidth} />
        </View>
        <View style={styles.headline}>
          <View style={styles.title}>
            <Text size="md" textAlign="center">
              {challenge.title}
            </Text>
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
      paddingHorizontal: Spacing['5xs'],
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
