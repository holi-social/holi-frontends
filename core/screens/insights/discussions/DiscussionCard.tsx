import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import StyleSheet from 'react-native-media-query'

import type { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import CommentText from '@holi/core/screens/comments/components/CommentText'
import { type CommentsMetadataResponse, commentsMetadata } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import ResponsesContainer from '@holi/core/screens/insights/discussions/ResponsesContainer'
import type { Discussion } from '@holi/core/screens/insights/types'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import StartDiscussion from './StartDiscussion'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import { Avatar } from 'holi-bricks/components/avatar'

type DiscussionCardProps = {
  discussion: Discussion
  insightId: string
}

const DiscussionCard = ({ discussion, insightId }: DiscussionCardProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const { navigateWithAuth } = useAuthRequiredNavigation()

  const { styles } = useMemo(() => getStyles(theme), [theme])

  const {
    data: { commentable } = {},
    loading,
  } = useQuery<CommentsMetadataResponse>(commentsMetadata, {
    variables: { commentableId: discussion.id, commentableType: CommentableType.DISCUSSION },
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

  const onPress = () => {
    if (latestCommenters.length > 0) {
      navigate(`/insights/${insightId}/discussions/${discussion.id}`)
    } else {
      navigateWithAuth(`/insights/${insightId}/discussions/${discussion.id}/comment`, {
        description: t('comments.loginRedirect.text'),
        trackTrigger: 'VIEW_DISCUSSION_COMMENT_ON_INSIGHT',
      })
    }
  }

  return (
    <HoliButton
      transparent
      inline
      contentStyle={styles.container}
      label={t('insights.discussions.title')}
      onPress={onPress}
    >
      <HoliText bold>{discussion.question}</HoliText>
      {loading ? (
        <LoadingSkeleton />
      ) : latestCommenters.length > 0 ? (
        <>
          {topComment && (
            <ResponsesContainer>
              <View style={styles.topComment}>
                <Avatar
                  imgSrc={topComment.creator.avatar}
                  imgPlaceholder={topComment.creator.avatarBlurhash}
                  label={topComment.creator.fullName || t('user.profileView.anonymous')}
                  initials={topComment.creator.avatarLabel}
                  size="xs"
                />
                <View style={styles.comment}>
                  <HoliText size="small" bold>
                    {topComment.creator.fullName || t('user.profileView.anonymous')}
                  </HoliText>
                  <CommentText
                    comment={topComment}
                    size="small"
                    color="gray300"
                    numberOfLines={2}
                    linkMentionsToProfile={false}
                  />
                </View>
              </View>
            </ResponsesContainer>
          )}
          <HoliUserAvatarPile users={latestCommenters as User[]} collapse counter />
        </>
      ) : (
        <StartDiscussion />
      )}
    </HoliButton>
  )
}

const LoadingSkeleton = () => <HoliSkeleton width="100%" height={60} borderRadius={4} />

const getStyles = ({ colors }: HoliTheme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      gap: Spacing.xxs,
      padding: Spacing.xs,
      backgroundColor: colors.background10,
      borderColor: colors.black300,
      borderWidth: 1,
      borderRadius: 16,
      [`@media (min-width: ${dimensions.breakpointM}px)`]: {
        padding: Spacing.md,
      },
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
