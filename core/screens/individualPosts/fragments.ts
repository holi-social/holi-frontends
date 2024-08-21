import { gql } from '@apollo/client'

import { LinkFragment } from '@holi/core/screens/comments/queries'
import { PostFragment } from '@holi/core/screens/posts/queries'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'

/* images {
  id
  image
  imageBlurhash
  order
  altText
} **/

export const FeedPostDetailsFragment = gql`
  ${UserAvatarFragment}
  ${LinkFragment}

  fragment FeedPostFull on FeedPost {
    __typename
    id
    slug
    title
    slug
    description
    visibility
    topics {
      id
    }
    category {
      id
      title
      label
    }
    createdAt
    imageUrl: image
    imageBlurhash
    author: creator {
      ...UserAvatar
    }
    myReaction {
      HEART
    }
    reactions {
      HEART
    }
    linkPreview {
      ...LinkFragment
    }
    totalComments
    commenters(limit: 5) {
      totalResults
      data {
        ...UserAvatar
      }
    }
    mentionedUsers: mentions {
      id
      fullName
    }
    language
    location
    geolocation {
      latitude
      longitude
    }
  }
`

export const GenericPostPagedFragment = gql`
  ${UserAvatarFragment}
  ${LinkFragment}
  ${PostFragment}
  ${FeedPostDetailsFragment}

  fragment GenericPostPagedFragment on GenericPostPaged {
    data {
      ... on Post {
        ...PostFragment
      }
      ... on FeedPost {
        ...FeedPostFull
      }
    }
    totalResults
  }
`
