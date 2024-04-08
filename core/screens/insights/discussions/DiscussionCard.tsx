import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { CommentsMetadataResponse, commentsMetadata } from '@holi/core/screens/comments/queries'
import { ComentableType } from '@holi/core/screens/comments/types'
import ResponsesContainer from '@holi/core/screens/insights/discussions/ResponsesContainer'
import { Discussion } from '@holi/core/screens/insights/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

import StartDiscussion from './StartDiscussion'

interface DiscussionCardProps {
  discussion: Discussion
}

const DiscussionCard = ({ discussion }: DiscussionCardProps) => {
  const { t } = useTranslation()

  const { data: { commentable } = {}, loading } = useQuery<CommentsMetadataResponse>(commentsMetadata, {
    variables: { commentableId: discussion.id, commentableType: ComentableType.DISCUSSION },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      logError(error, 'Failed to load discussion comments metadata', {
        location: 'InsightDetailPage.discussion',
        discussionId: discussion.id,
      })
    },
  })

  const latestCommenters: readonly User[] = commentable?.commenters?.data || []
  const topComment = commentable?.topComment

  return (
    <View style={styles.container}>
      <HoliText bold>{discussion.question}</HoliText>
      {latestCommenters.length > 0 ? (
        <>
          {topComment && (
            <ResponsesContainer>
              <View style={styles.topComment}>
                <HoliAvatar
                  imageSrc={topComment.creator.avatar}
                  imageBlurhash={topComment.creator.avatarBlurhash}
                  label={topComment.creator.fullName || t('user.profileView.anonymous')}
                  initials={topComment.creator.avatarLabel || ''}
                  defaultColor={topComment.creator.avatarDefaultColor || ''}
                  size="micro"
                />

                <View style={styles.comment}>
                  <HoliText size="small" bold>
                    {topComment.creator.fullName || t('user.profileView.anonymous')}
                  </HoliText>
                  <HoliText size="small" color="gray300" numberOfLines={2}>
                    {topComment.text}
                  </HoliText>
                </View>
              </View>
            </ResponsesContainer>
          )}
          <HoliUserAvatarPile users={latestCommenters} collapse counter />
        </>
      ) : (
        <StartDiscussion />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    gap: Spacing.xxs,
    padding: Spacing.xs,
    backgroundColor: colors.background10,
    borderColor: colors.black300,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },
  topComment: {
    display: 'flex',
    flexDirection: 'row',
    gap: Spacing['3xs'],
  },
  comment: {
    display: 'flex',
    flexShrink: 1,
    gap: Spacing['4xs'],
  },
})

export default DiscussionCard
