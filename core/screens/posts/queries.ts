import { gql } from '@apollo/client/core'

import { FullUserAvatarFragment } from '@holi/core/domain/shared/queries'
import { LinkFragment } from '@holi/core/screens/comments/queries'
import type { Post } from '@holi/core/screens/posts/types'

export const PostImageFragment = gql`
  fragment PostImageData on PostImage {
    id
    url
    height
    width
  }
`

export const PostFragment = gql`
  ${FullUserAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment PostFragment on Post {
    __typename
    id
    title
    text
    created
    modified
    creator {
      ...FullUserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...FullUserAvatar
      }
    }
    space {
      id
      title
      name
      avatar
      avatarBlurhash
      avatarDefaultColor
      connectionStatusToMyself
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
    reactors(limit: 50) {
      totalResults
      data {
        ...FullUserAvatar
      }
    }
    isPublic
    language
  }
`

export const PostDetailsFragment = gql`
  ${FullUserAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment PostFull on Post {
    __typename
    id
    title
    text
    created
    modified
    creator {
      ...FullUserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...FullUserAvatar
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
    reactors(limit: 50) {
      totalResults
      data {
        ...FullUserAvatar
      }
    }
    isPublic
    language
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
