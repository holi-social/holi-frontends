import { gql } from '@apollo/client/core'

import { LinkFragment } from '@holi/core/screens/comments/queries'
import { Comment, CommentableType, ReactionType } from '@holi/core/screens/comments/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'

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

export type CreateCommentInput = {
  commentableId: string
  commentableType: CommentableType
  text: string
}

export const AddCommentMutation = gql`
  ${CommentFragment}

  mutation AddComment($input: CreateCommentInput!) {
    addComment(input: $input) {
      ...CommentFull
    }
  }
`

export type CreateCommentResponse = {
  comment: Comment
}

export type CommentReactionInput = {
  commentId: string
  reactionType: ReactionType
}

export const AddReactionToCommentMutation = gql`
  ${CommentFragment}

  mutation AddReactionToComment($input: CommentReactionInput!) {
    addReactionToComment(input: $input) {
      ...CommentFull
    }
  }
`

export const RemoveReactionFromCommentMutation = gql`
  ${CommentFragment}

  mutation RemoveReactionFromComment($input: CommentReactionInput!) {
    removeReactionFromComment(input: $input) {
      ...CommentFull
    }
  }
`

export const DeleteCommentMutation = gql`
  mutation DeleteComment($id: UUID!) {
    deleteComment(id: $id) {
      success
    }
  }
`

export interface DeleteCommentResponse {
  success: boolean
}
