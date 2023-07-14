import { gql } from '@apollo/client'

import { LinkFragment, PostImageFragment } from '@holi/core/screens/posts/queries'
import { VisibilityFilter } from '@holi/core/screens/spaces/types'
import { FullUserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const SpaceUpdatePostFragment = gql`
  ${FullUserAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment SpaceUpdatePostFragment on Post {
    id
    title
    text
    created
    creator {
      ...FullUserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...FullUserAvatar
      }
    }
    image {
      ...PostImageData
    }
    links {
      ...LinkFragment
    }
    mentions {
      id
      fullName
    }
    myReaction {
      HEART
    }
    reactions {
      HEART
    }
    isPublic
  }
`

export interface SpaceByIdQueryVariables {
  idOrName: string
  offset: number
  limit: number
  visibility: VisibilityFilter
}

export const spacePostsQuery = gql`
  ${SpaceUpdatePostFragment}
  query SpacePostsBySpaceId($idOrName: String!, $offset: Int!, $limit: Int!, $visibility: VisibilityFilter!) {
    spaceById(idOrName: $idOrName) {
      id
      hasPublicPosts
      hasPrivatePosts
      posts(offset: $offset, limit: $limit, visibility: $visibility) {
        data {
          ...SpaceUpdatePostFragment
        }
      }
    }
  }
`
