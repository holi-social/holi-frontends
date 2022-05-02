import { gql } from '@apollo/client/core'

import { Post } from './types'

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    id
    title
    text
    image
    views
    User {
      id
      name
    }
  }
`

export const ALL_POSTS_QUERY = gql`
  ${POST_FRAGMENT}

  query Posts($offset: Int, $limit: Int) {
    allPosts(offset: $offset, limit: $limit) {
      ...PostFragment
    }
  }
`

export interface AllPostsQueryResult {
  allPosts: Post[]
}

export const POST_BY_ID = gql`
  ${POST_FRAGMENT}

  query Post($id: ID!) {
    Post(id: $id) {
      ...PostFragment
    }
  }
`

export interface PostByIdQueryResult {
  Post: Post
}
