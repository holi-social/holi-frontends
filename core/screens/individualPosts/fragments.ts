import { gql } from '@apollo/client'

import { FullUserAvatarFragment } from '@holi/core/domain/shared/queries'
import { LinkFragment } from '@holi/core/screens/comments/queries'
import { PollFragment } from '@holi/core/screens/polls/queries'

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
      slug
    }
    createdAt
    imageUrl: image
    imageBlurhash
    imageUrls
    aspectRatio
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
    reactors(limit: 50) {
      totalResults
      data {
        ...FullUserAvatar
      }
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
