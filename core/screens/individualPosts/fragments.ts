import { gql } from '@apollo/client'

import { LinkFragment } from '@holi/core/screens/comments/queries'

export const FeedPostDetailsFragment = gql`
  ${LinkFragment}
  fragment FeedPostFull on FeedPost {
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
    }
    createdAt
    image
    imageBlurhash
    creator {
      id
      avatar
      avatarBlurhash
      avatarLabel
      avatarDefaultColor
      firstName
      fullName
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
  }
`
