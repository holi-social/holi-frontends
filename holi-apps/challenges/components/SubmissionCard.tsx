import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import type { TrackingEvent } from '@holi/core/tracking'
import { colors } from '@holi/ui/styles/globalVars'
import { Image } from 'holi-bricks/components/image'

import type { Submission } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { Avatar } from 'holi-bricks/components/avatar'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { Spacing } from 'holi-bricks/foundations'

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
  const imageHeight = Platform.OS === 'web' ? 248 : IMAGE_HEIGHT
  const { track } = useTracking()

  return (
    <View style={styles.container}>
      <HoliLink
        label={label}
        href={createInAppChallengesPath(submission.playerPath)}
        onPress={(ev) => {
          track(trackingEvent)
          ev.stopPropagation()
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={submission.imageUrl} alt={label} width={width} height={imageHeight} />
        </View>

        <View style={styles.avatar}>
          <Avatar
            size="xs"
            source={submission.submitter.avatarUrl || undefined}
            label={submission.submitter.username}
            initials={initials}
          />
        </View>
      </HoliLink>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    flex: 1,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  avatar: {
    position: 'absolute',
    bottom: Spacing['3xs'],
    left: Spacing['3xs'],
  },
})
