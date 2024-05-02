import { gql } from '@apollo/client'

import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const FeedPostDetailsFragment = gql`
  ${UserAvatarFragment}

  fragment FeedPostFull on FeedPost {
    id
    title
    description
    visibility
    topics {
      id
    }
    category {
      id
    }
    createdAt
    image
    imageBlurhash
    creator {
      ...UserAvatar
    }
  }
`
