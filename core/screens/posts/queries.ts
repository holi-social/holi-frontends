import { gql } from '@apollo/client/core'

import { Post } from '@holi/core/screens/posts/types'

export const PostCommentFragment = gql`
  fragment PostCommentFull on PostComment {
    id
    text
    created
    creator {
      id
      avatar
      avatarLabel
      avatarDefaultColor
      firstName
      lastName
      fullName
      aboutMe
    }
    mentions {
      id
      fullName
    }
  }
`

export const PostFragment = gql`
  ${PostCommentFragment}

  fragment PostFull on Post {
    id
    title
    text
    created
    creator {
      id
      avatar
      avatarLabel
      avatarDefaultColor
      firstName
      lastName
      fullName
      aboutMe
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
