import { gql } from '@apollo/client'

import { LinkFragment, PostImageFragment } from '@holi/core/screens/posts/queries'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const SpaceUpdatePostFragment = gql`
  ${userAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment SpaceUpdatePostFragment on Post {
    id
    title
    text
    created
    creator {
      ...UserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...UserAvatar
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

export const spacePostsQuery = gql`
  ${SpaceUpdatePostFragment}
  query SpaceById($idOrName: String!, $offset: Int!, $limit: Int!, $visibility: VisibilityFilter!) {
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
