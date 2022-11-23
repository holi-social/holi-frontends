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
