import { gql } from '@apollo/client'

import { FullUserAvatarFragment } from '@holi/core/domain/shared/queries'
import { LinkFragment } from '@holi/core/screens/comments/queries'
import { PollFragment } from '@holi/core/screens/polls/queries'
import { PostFragment } from '@holi/core/screens/posts/queries'

export const FeedPostDetailsFragment = gql`
  ${FullUserAvatarFragment}
  ${LinkFragment}
  ${PollFragment}

  fragment FeedPostFull on FeedPost {
    __typename
    id
    slug
    title
    description
    visibility
    topicsV2
    category {
      id
      title
      label
    }
    createdAt
    imageUrl: image
    imageBlurhash
    images {
      id
      image
      order
      altText
      aspectRatio
    }
    author: creator {
      ...FullUserAvatar
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
        ...FullUserAvatar
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
    poll {
      ...PollFragment
    }
  }
`

export const GenericPostPagedFragment = gql`
  ${FullUserAvatarFragment}
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
