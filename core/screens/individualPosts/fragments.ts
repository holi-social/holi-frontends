import { gql } from '@apollo/client'

import { LinkFragment } from '@holi/core/screens/comments/queries'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const FeedPostDetailsFragment = gql`
  ${UserAvatarFragment}
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
      label
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
    totalComments
    commenters(limit: 5) {
      totalResults
      data {
        ...UserAvatar
      }
    }
  }
`
