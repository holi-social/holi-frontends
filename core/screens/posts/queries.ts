import { gql } from '@apollo/client/core'

import { LinkFragment } from '@holi/core/screens/comments/queries'
import { Post } from '@holi/core/screens/posts/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const PostImageFragment = gql`
  fragment PostImageData on PostImage {
    id
    url
    height
    width
  }
`

export const PostFragment = gql`
  ${UserAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment PostFragment on Post {
    id
    title
    text
    created
    modified
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
    space {
      id
      title
      name
      avatar
      avatarBlurhash
      avatarDefaultColor
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

export const PostDetailsFragment = gql`
  ${UserAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment PostFull on Post {
    id
    title
    text
    created
    modified
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

export const PostById = gql`
  ${PostDetailsFragment}

  query PostById($id: UUID!) {
    postById(id: $id) {
      ...PostFull
    }
  }
`

export type PostByIdResponse = {
  postById: Post
}

export const UpdatePostReactionMutation = gql`
  ${PostFragment}

  mutation UpdatePostReaction($id: UUID!, $reactionType: ReactionType!, $reactionAction: ReactionAction!) {
    updatePostReaction(id: $id, reactionType: $reactionType, reactionAction: $reactionAction) {
      ...PostFragment
    }
  }
`

export interface UpdatePostReactionResponse {
  post: Post
}
