import { gql } from '@apollo/client'

import { CommentFragment } from '@holi/core/screens/comments/queries'
import type { Comment, CommentableType, ReactionType } from '@holi/core/screens/comments/types'

export type CreateCommentInput = {
  commentableId: string
  commentableType: CommentableType
  text: string
  parentCommentId?: string
  language?: string
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

export interface AddReactionToCommentResponse {
  addReactionToComment: Comment
}

export const AddReactionToCommentMutation = gql`
  ${CommentFragment}

  mutation AddReactionToComment($input: CommentReactionInput!) {
    addReactionToComment(input: $input) {
      ...CommentFull
    }
  }
`

export interface RemoveReactionFromCommentResponse {
  removeReactionFromComment: Comment
}

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
