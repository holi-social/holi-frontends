import { useQuery } from '@apollo/client'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType } from '@holi/core/queries'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { CommentsResponse, commentsByCommentable } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'

interface CommentsProps {
  commentableId: string
  commentableType: CommentableType
  replyRoute?: string // the route to be redirected to when clicking "reply". If undefined, no reply button is displayed
}

const Comments = ({ commentableId, commentableType, replyRoute }: CommentsProps) => {
  const { navigate } = useRouting()
  const { data: { commentable } = {} } = useQuery<CommentsResponse>(commentsByCommentable, {
    variables: { commentableId, commentableType },
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

  return (
    <>
      <View style={latestCommenters.length > 1 ? styles.commentersContainerMany : styles.commentersContainerSingle}>
        <HoliUserAvatarPile users={latestCommenters as User[]} collapse counter />
      </View>
      <View style={styles.commentersLine}>
        <VerticalLine />
      </View>
      {comments.map((comment) => (
        <CommentView
          key={comment.id}
          comment={comment}
          commentableId={commentableId}
          commentableType={commentableType}
          reportContentType={ContentType.POST_COMMENT}
          {...(replyRoute ? { onPressComment: () => navigate(`${replyRoute}?commentId=${comment.id}`) } : {})}
        />
      ))}
    </>
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
})

export default Comments
