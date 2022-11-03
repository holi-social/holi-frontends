import { gql } from '@apollo/client/core'

import { Post } from '@holi/core/screens/posts/types'

const PostFragment = gql`
  fragment PostFull on Post {
    id
    title
    description
    datePublished
    curator {
      id
      avatar
      firstName
      lastName
      aboutMe
    }
    headerImage
    posts {
      id
      text
      creator {
        id
        firstName
        lastName
        avatar
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
