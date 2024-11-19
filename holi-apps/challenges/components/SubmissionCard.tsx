import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import type { TrackingEvent } from '@holi/core/tracking'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

import type { Submission } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { Avatar } from 'holi-bricks/components/avatar'

const IMAGE_HEIGHT = 195

interface SubmissionCardProps {
  challengeTitle: string
  submission: Submission
  width: number
  trackingEvent: TrackingEvent
}

export const SubmissionCard = ({ challengeTitle, submission, width, trackingEvent }: SubmissionCardProps) => {
  const label = `${challengeTitle} | ${submission.submitter.username}`
  const initials = submission.submitter.username.slice(0, 2)

  return (
    <View style={styles.container}>
      <HoliLinkTracked
        label={label}
        href={createInAppChallengesPath(submission.playerPath)}
        trackingEvent={trackingEvent}
      >
        <HoliImage
          source={{ uri: submission.imageUrl, width, height: IMAGE_HEIGHT }}
          label={label}
          style={styles.image}
        />
        <View style={styles.avatar}>
          <Avatar
            size="xs"
            imgSrc={submission.submitter.avatarUrl || undefined}
            label={submission.submitter.username}
            initials={initials}
          />
        </View>
      </HoliLinkTracked>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    flex: 1,
  },
  image: {
    minHeight: IMAGE_HEIGHT,
    borderRadius: 8,
  },
  avatar: {
    position: 'absolute',
    bottom: dimensions.spacingXs,
    left: dimensions.spacingXs,
  },
})
