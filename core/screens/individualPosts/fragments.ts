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
      title
    }
    createdAt
    image
    imageBlurhash
    creator {
      ...UserAvatar
    }
    myReaction {
      HEART
    }
    reactions {
      HEART
    }
  }
`
