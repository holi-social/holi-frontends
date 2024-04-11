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

// TODO: should we still get PostComment type from BE? Shouldn't it be generic? This leads to the redundant CommentFragment below
export const PostCommentFragment = gql`
  ${UserAvatarFragment}
  ${LinkFragment}

  fragment PostCommentFull on PostComment {
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
      }
      commenters(limit: 5) {
        totalResults
        data {
          ...UserAvatar
        }
      }
    }
  }
`

export type CommentsMetadataResponse = {
  commentable: {
    id: string
    type: CommentableType
    topComment?: Comment
    commenters: Paged<User>
  }
}

export const commentsByCommentable = gql`
  ${CommentFragment}

  query Comments($commentableId: UUID!, $commentableType: CommentableType!) {
    commentable(id: $commentableId, type: $commentableType) {
      id
      type
      comments {
        totalResults
        data {
          ...CommentFull
        }
      }
    }
  }
`

export type CommentsResponse = {
  commentable: {
    id: string
    type: CommentableType
    comments: Paged<Comment>
  }
}
