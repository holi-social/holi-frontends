import { gql } from '@apollo/client/core'

import { Post } from '@holi/core/screens/posts/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const PostCommentFragment = gql`
  ${userAvatarFragment}
  fragment PostCommentFull on PostComment {
    id
    text
    created
    creator {
      ...UserAvatar
    }
    mentions {
      id
      fullName
    }
  }
`

export const PostFragment = gql`
  ${userAvatarFragment}
  ${PostCommentFragment}

  fragment PostFull on Post {
    id
    title
    text
    created
    creator {
      ...UserAvatar
    }
    comments {
      ...PostCommentFull
    }
    mentions {
      id
      fullName
    }
  }
`

export const PostById = gql`
  ${PostFragment}

  query PostById($id: String!) {
    postById(id: $id) {
      ...PostFull
    }
  }
`

export type PostByIdResponse = {
  postById: Post
}

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
