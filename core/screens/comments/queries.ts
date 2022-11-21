import { gql } from '@apollo/client/core'

import { PostFragment } from '@holi/core/screens/posts/queries'
import { Post } from '@holi/core/screens/posts/types'

export type CreatePostCommentInput = {
  postId: string
  text: string
}

export const CreatePostCommentMutation = gql`
  ${PostFragment}
  mutation CreatePostComment($input: CreatePostCommentInput!) {
    updatePostComment(input: $input) {
      postById {
        ...PostFull
      }
    }
  }
`

export type CreatePostCommentResponse = {
  postComment: Comment
  postById: Post
}
