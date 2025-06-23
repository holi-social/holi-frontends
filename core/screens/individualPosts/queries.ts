import { gql } from '@apollo/client/core'

import { FeedPostDetailsFragment } from '@holi/core/screens/individualPosts/fragments'
import { Category, FeedPost } from '@holi/core/screens/individualPosts/types'
import { Paged } from '@holi/core/types'

export const feedPostCategoriesQuery = gql`
  query FeedPostCategories {
    feedPostCategories {
      data {
        id
        title
        slug
      }
    }
  }
`

export interface FeedPostCategoriesQueryResult {
  feedPostCategories: Paged<Category>
}

export const myPostsQuery = gql`
  ${FeedPostDetailsFragment}

  query MyPosts($offset: Int! = 0, $limit: Int! = 10) {
    myPosts(offset: $offset, limit: $limit) {
      data {
        ...FeedPostFull
      }
      totalResults
    }
  }
`

export type MyPostsQueryResponse = {
  myPosts: Paged<FeedPost>
}

export const postsByUserIdQuery = gql`
  ${FeedPostDetailsFragment}

  query PostsByUserId($userId: UUID!, $offset: Int! = 0, $limit: Int! = 10) {
    postsByUserId(userId: $userId, offset: $offset, limit: $limit) {
      data {
        ...FeedPostFull
      }
      totalResults
    }
  }
`

export type PostsByUserIdQueryResponse = {
  postsByUserId: Paged<FeedPost>
}

export const postQuery = gql`
  ${FeedPostDetailsFragment}

  query post($idOrSlug: String!) {
    post(idOrSlug: $idOrSlug) {
      ...FeedPostFull
    }
  }
`

export type PostQueryResponse = {
  post: FeedPost
}
