import { gql } from '@apollo/client'

export const FeedPostDetailsFragment = gql`
  fragment FeedPostFull on FeedPost {
    id
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
  }
`
