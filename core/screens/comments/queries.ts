import { gql } from '@apollo/client/core'

import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const LinkFragment = gql`
  fragment LinkFragment on LinkPreview {
    requestedUrl
    url
    title
    description
    type
    image
    siteName
    origin
    icon
  }
`

// TODO: should we still get PostComment type from BE? Shouldn't it be generic? This leads to the redundant CommentFragment below
export const PostCommentFragment = gql`
  ${UserAvatarFragment}
  ${LinkFragment}

  fragment CommentFull on PostComment {
    id
    text
    created
    modified
    creator {
      ...UserAvatar
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
  }
`

export const CommentFragment = gql`
  ${UserAvatarFragment}
  ${LinkFragment}

  fragment CommentFull on Comment {
    id
    text
    created
    modified
    creator {
      ...UserAvatar
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
  }
`
