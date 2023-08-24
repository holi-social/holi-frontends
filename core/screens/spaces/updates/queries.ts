import { gql } from '@apollo/client'

import { PostFragment } from '@holi/core/screens/posts/queries'
import { VisibilityFilter } from '@holi/core/screens/spaces/types'

export interface SpaceByIdQueryVariables {
  idOrName: string
  offset: number
  limit: number
  visibility: VisibilityFilter
}

export const spacePostsQuery = gql`
  ${PostFragment}
  query SpacePostsBySpaceId($idOrName: String!, $offset: Int!, $limit: Int!, $visibility: VisibilityFilter!) {
    spaceById(idOrName: $idOrName) {
      id
      hasPublicPosts
      hasPrivatePosts
      posts(offset: $offset, limit: $limit, visibility: $visibility) {
        data {
          ...PostFragment
        }
      }
    }
  }
`
