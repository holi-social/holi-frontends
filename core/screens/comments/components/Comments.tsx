import { useQuery } from '@apollo/client'
import React, { type ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { type CommentsResponse, commentsByCommentable } from '@holi/core/screens/comments/queries'
import type { CommentableType } from '@holi/core/screens/comments/types'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'
import type { Post } from '@holi/core/screens/posts/types'
import type { FeedPost } from '@holi/core/screens/individualPosts/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import PostReactButton from '@holi/core/screens/individualPosts/components/PostReactButton'

interface CommentsProps {
  commentableId: string
  commentableType: CommentableType
  parentCommentId?: string
  replyRoute?: string // the route to be redirected to when clicking "reply". If undefined, no reply button is displayed
  onPressCreateComment?: () => void
  isReply?: boolean
  initialOpenThread?: string
  reactionButton?: ReactNode
  isDiscussion?: boolean
  post?: FeedPost | Post
}

const Comments = ({
  commentableId,
  commentableType,
  parentCommentId,
  replyRoute,
  onPressCreateComment,
  initialOpenThread,
  reactionButton,
  isDiscussion = true,
  post,
}: CommentsProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const {
    data: { commentable } = {},
    refetch,
  } = useQuery<CommentsResponse>(commentsByCommentable, {
    variables: { commentableId, commentableType, parentCommentId },
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      logError(error, 'Failed to load comments', {
        location: 'Comments',
        variables: { commentableId, commentableType },
      })
    },
  })
  useOnRefresh(refetch)

  const latestCommenters = commentable?.commenters?.data || []
  const comments = commentable?.comments?.data || []
  const totalComments = commentable?.totalComments

  if (!commentable) return <Skeleton />

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
          <View
            style={[
              styles.commenters,
              latestCommenters.length > 1 ? styles.commentersContainerMany : styles.commentersContainerSingle,
            ]}
          >
            {isDiscussion ? (
              <HoliUserAvatarPile users={latestCommenters as User[]} collapse counter />
            ) : (
              <HoliUserAvatarPile users={latestCommenters as User[]} usersToShow={3} collapse>
                {t('comments.response', { count: totalComments })}
              </HoliUserAvatarPile>
            )}
            {reactionButton}
          </View>
          <View style={styles.reactionContainer}>{post && <PostReactButton post={post} />}</View>
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
            {...(replyRoute ? { onPressComment: () => navigate(`${replyRoute}?commentId=${comment.id}`) } : {})}
            avatarSize={parentCommentId ? 'xs' : 'sm'}
            startWithOpenThread={initialOpenThread == comment.id}
          />
        ))}
      </View>
    </>
  )
}

const Skeleton = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <View style={styles.skeletonContainer}>
      <HoliSkeleton height={Spacing.sm} width={Spacing.sm} borderRadius={12} />
      <HoliSkeleton height={Spacing.xxl} width={'80%'} borderRadius={16} />
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    commenters: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
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
    reactionContainer: {
      borderTopWidth: 1,
      borderColor: theme.colors.background30,
      marginLeft: Spacing.sm,
      marginTop: Spacing.xs,
      paddingTop: Spacing.xxs,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  })

export default Comments
