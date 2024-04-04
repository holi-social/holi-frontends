import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { CommentsMetadataResponse, commentsMetadata } from '@holi/core/screens/comments/queries'
import { ComentableType } from '@holi/core/screens/comments/types'
import { Discussion } from '@holi/core/screens/insights/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

interface DiscussionCardProps {
  discussion: Discussion
}

const DiscussionCard = ({ discussion }: DiscussionCardProps) => {
  const { t } = useTranslation()

  const { data: { topComment, commenters } = {}, loading } = useQuery<CommentsMetadataResponse>(commentsMetadata, {
    variables: { commentableId: discussion.id, commentableType: ComentableType.DISCUSSION },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      logError(error, 'Failed to load discussion comments metadata', {
        location: 'InsightDetailPage.discussion',
        discussionId: discussion.id,
      })
    },
  })

  const latestCommenters: readonly User[] = commenters?.data || []

  return (
    <View style={styles.card}>
      <HoliText style={styles.question}>{discussion.question}</HoliText>
      {latestCommenters.length > 0 ? <View>comments</View> : <View>No comments</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xs,
    backgroundColor: colors.background10,
    borderColor: colors.black300,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },
  question: {
    marginBottom: Spacing.xxs,
  },
})

export default DiscussionCard
