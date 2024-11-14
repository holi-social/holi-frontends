import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

import { Submission } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'

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
        <HoliAvatar
          size="micro"
          imageSrc={submission.submitter.avatarUrl || undefined}
          label={submission.submitter.username}
          loading={false}
          style={styles.avatar}
          initials={initials}
        />
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
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.white100,
  },
})
