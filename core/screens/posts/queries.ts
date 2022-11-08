import { gql } from '@apollo/client/core'

import { Post } from '@holi/core/screens/posts/types'

export const PostFragment = gql`
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
      aboutMe
    }
    comments {
      id
      text
      created
      commenter {
        id
        avatar
        avatarLabel
        avatarDefaultColor
        firstName
        lastName
        aboutMe
      }
    }
  }
`

export const lastPostsQuery = gql`
  ${PostFragment}

  query LastPosts($numberOfItems: Int!) {
    lastPosts(numberOfItems: $numberOfItems) {
      ...PostFull
    }
  }
`

export type LastPostsResponse = {
  lastPosts: Post[]
}

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
