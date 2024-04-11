import { useQuery } from '@apollo/client'
import React from 'react'
import { View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { ContentType } from '@holi/core/queries'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import { CommentsResponse, commentsByCommentable } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import { Comment } from '@holi/core/screens/comments/types'

type CommentsProps = {
  commentableId: string
  commentableType: CommentableType
}

const Comments = ({ commentableId, commentableType }: CommentsProps) => {
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

  const comments: readonly Comment[] = commentable?.comments?.data || []

  return (
    <View>
      {comments.map((comment) => {
        return (
          <CommentView
            key={comment.id}
            comment={comment}
            commentableId={commentableId}
            commentableType={commentableType}
            reportContentType={ContentType.POST_COMMENT}
          />
        )
      })}
    </View>
  )
}

export default Comments
