import { gql } from '@apollo/client/core'

import { Comment, CommentableType } from '@holi/core/screens/comments/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import type { Paged } from '@holi/core/types'

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
    totalReplies
    replies {
      id
    }
  }
`

export const commentsMetadata = gql`
  ${UserAvatarFragment}

  query CommentsMetadata($commentableId: UUID!, $commentableType: CommentableType!) {
    commentable(id: $commentableId, type: $commentableType) {
      id
      type
      topComment {
        text
        creator {
          ...UserAvatar
        }
        mentions {
          id
          fullName
        }
      }
      commenters(limit: 5) {
        totalResults
        data {
          ...UserAvatar
        }
      }
      totalComments
    }
  }
`

export type CommentsMetadataResponse = {
  commentable: {
    id: string
    type: CommentableType
    topComment?: Comment
    commenters: Paged<User>
    totalComments: number
  }
}

export const commentsByCommentable = gql`
  ${CommentFragment}

  query Comments(
    $commentableId: UUID!
    $commentableType: CommentableType!
    $parentCommentId: UUID
    $offset: Int! = 0
    $limit: Int! = 100
  ) {
    commentable(id: $commentableId, type: $commentableType) {
      id
      type
      commenters(limit: 5) {
        totalResults
        data {
          ...UserAvatar
        }
      }
      comments(offset: $offset, limit: $limit, parentCommentId: $parentCommentId) {
        totalResults
        data {
          ...CommentFull
        }
      }
      totalComments
    }
  }
`

export type CommentsResponse = {
  commentable: {
    id: string
    type: CommentableType
    comments: Paged<Comment>
    commenters: Paged<User>
    totalComments: number
  }
}

export const commentById = gql`
  ${CommentFragment}
  query Comment($commentId: UUID!) {
    commentById(id: $commentId) {
      ...CommentFull
    }
  }
`

export type CommentResponse = {
  commentById: Comment
}
