import { gql } from '@apollo/client/core'

import { PostCommentFragment, PostFragment } from '@holi/core/screens/posts/queries'
import { Post } from '@holi/core/screens/posts/types'

export type CreatePostCommentInput = {
  postId: string
  text: string
}

export const CreatePostCommentMutation = gql`
  ${PostFragment}
  ${PostCommentFragment}

  mutation CreatePostComment($input: CreatePostCommentInput!) {
    updatePostComment(input: $input) {
      postComment {
        ...PostCommentFull
      }
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
