import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

import { Submission } from '@holi-apps/challenges/components/types'
import { createChallengesPath } from '@holi-apps/challenges/helpers/navigation'

const IMAGE_HEIGHT = 195

interface SubmissionCardProps {
  challengeTitle: string
  submission: Submission
  width: number
}

export const SubmissionCard = ({ challengeTitle, submission, width }: SubmissionCardProps) => {
  const label = `${challengeTitle} | ${submission.submitter.username}`
  const initials = submission.submitter.username.slice(0, 2)

  return (
    <View style={styles.container}>
      <HoliLink label={label} href={createChallengesPath(submission.playerPath)}>
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
