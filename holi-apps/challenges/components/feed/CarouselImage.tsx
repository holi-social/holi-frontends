import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import type { TrackingEvent } from '@holi/core/tracking'
import { Spacing } from 'holi-bricks/tokens/dimensions/spacing'

import type { Submission } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { VideoFilled, Lock } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Image } from 'holi-bricks/components/image'
import { mono } from 'holi-bricks/tokens'

interface CarouselImageProps {
  challengeTitle: string
  challenge: Submission
  width: number
  trackingEvent: TrackingEvent
  participants?: number
  isUpcoming?: boolean
}

export const CarouselImage = ({
  challengeTitle,
  challenge,
  width,
  trackingEvent,
  participants,
  isUpcoming,
}: CarouselImageProps) => {
  const label = `${challengeTitle} | ${challenge.submitter.username}`

  return (
    <View style={[styles.container]}>
      <HoliLinkTracked
        label={label}
        href={createInAppChallengesPath(challenge.playerPath)}
        trackingEvent={trackingEvent}
      >
        {!isUpcoming && (
          <View style={styles.avatar}>
            <Text size="sm" colorOverride={mono['100']}>
              {participants}
            </Text>
            <HoliIcon icon={VideoFilled} size={12} color={mono['100']} style={styles.participantsIcon} />
          </View>
        )}

        <View style={styles.imageContainer}>
          <Image source={challenge.imageUrl} width={width} height={width} alt={label} />
        </View>
        {isUpcoming && (
          <View style={styles.lockOverlay}>
            <HoliIcon icon={Lock} size={32} color={mono['100']} />
          </View>
        )}
      </HoliLinkTracked>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  avatar: {
    zIndex: 1,
    color: 'white',
    position: 'absolute',
    bottom: Spacing['3xs'],
    right: Spacing['3xs'] + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['4xs'],
  },
  participantsIcon: {
    padding: 2,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
