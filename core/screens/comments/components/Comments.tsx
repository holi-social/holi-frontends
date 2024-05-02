import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType } from '@holi/core/queries'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { CommentsResponse, commentsByCommentable } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'

interface CommentsProps {
  commentableId: string
  commentableType: CommentableType
  parentCommentId?: string
  replyRoute?: string // the route to be redirected to when clicking "reply". If undefined, no reply button is displayed
  onPressCreateComment?: () => void
  isReply?: boolean
}

const Comments = ({
  commentableId,
  commentableType,
  parentCommentId,
  replyRoute,
  onPressCreateComment,
}: CommentsProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { data: { commentable } = {}, loading } = useQuery<CommentsResponse>(commentsByCommentable, {
    variables: { commentableId, commentableType, parentCommentId },
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      logError(error, 'Failed to load comments', {
        location: 'Comments',
        variables: { commentableId, commentableType },
      })
    },
  })

  const latestCommenters = commentable?.commenters?.data || []
  const comments = commentable?.comments?.data || []

  if (loading) return <Skeleton />

  if (!comments.length && !onPressCreateComment) return <></>

  if (!comments.length)
    return (
      <HoliButton transparent inline label={t('insights.discussions.empty')} onPress={onPressCreateComment}>
        <HoliText color="gray300" size="small">
          {t('insights.discussions.empty')}
        </HoliText>
      </HoliButton>
    )

  return (
    <>
      {!parentCommentId && (
        <>
          <View style={latestCommenters.length > 1 ? styles.commentersContainerMany : styles.commentersContainerSingle}>
            <HoliUserAvatarPile users={latestCommenters as User[]} collapse counter />
          </View>
          <View style={styles.commentersLine}>
            <VerticalLine style={parentCommentId ? styles.commentersLineReplies : {}} />
          </View>
        </>
      )}
      <View style={styles.commentsContainer}>
        {comments.map((comment) => (
          <CommentView
            key={comment.id}
            comment={comment}
            commentableId={commentableId}
            commentableType={commentableType}
            reportContentType={ContentType.POST_COMMENT}
            {...(replyRoute ? { onPressComment: () => navigate(`${replyRoute}?commentId=${comment.id}`) } : {})}
            avatarSize={parentCommentId ? 'micro' : 'small'}
          />
        ))}
      </View>
    </>
  )
}

const Skeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      <HoliSkeleton height={Spacing.sm} width={Spacing.sm} borderRadius={12} />
      <HoliSkeleton height={Spacing.xxl} width={'80%'} borderRadius={16} />
    </View>
  )
}

const styles = StyleSheet.create({
  commentersContainerSingle: {
    marginLeft: Spacing['3xs'],
  },
  commentersContainerMany: {
    marginLeft: 2,
  },
  commentersLine: {
    marginLeft: Spacing.sm,
    marginVertical: Spacing['3xs'],
  },
  commentersLineReplies: {
    marginLeft: Spacing['3xs'],
    marginVertical: Spacing['3xs'],
  },
  commentsContainer: {
    gap: Spacing.xs,
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
})

export default Comments
