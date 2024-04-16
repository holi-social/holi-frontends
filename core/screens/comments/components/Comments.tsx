import { useQuery } from '@apollo/client'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { ContentType } from '@holi/core/queries'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { CommentsResponse, commentsByCommentable } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import { Comment } from '@holi/core/screens/comments/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'

interface CommentsProps {
  commentableId: string
  commentableType: CommentableType
  isCommentable?: boolean // isCommentable allows users to create a second level comment (reply to a comment)
}

const Comments = ({ commentableId, commentableType, isCommentable }: CommentsProps) => {
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

  const latestCommenters: readonly User[] = commentable?.commenters?.data || []
  const comments: readonly Comment[] = commentable?.comments?.data || []

  return (
    <>
      <View style={latestCommenters.length > 1 ? styles.commentersContainerMany : styles.commentersContainerSingle}>
        <HoliUserAvatarPile users={latestCommenters} collapse counter />
      </View>
      <View style={styles.commentersLine}>
        <VerticalLine />
      </View>
      {comments.map((comment) => {
        return (
          <CommentView
            key={comment.id}
            comment={comment}
            commentableId={commentableId}
            commentableType={commentableType}
            reportContentType={ContentType.POST_COMMENT}
            {...(isCommentable ? { onPressComment: () => null } : {})}
          />
        )
      })}
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
