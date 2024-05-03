import type { User } from '@holi/core/screens/userprofile/types'

export enum ReactionType {
  HEART = 'HEART',
}

export enum ReactionAction {
  'SET' = 'SET',
  'REMOVE' = 'REMOVE',
}

export interface ReactionCounts {
  HEART: number
}

export interface Comment {
  id: string
  text: string
  creator: User
  created?: string // "2022-10-06T17:50:41.661594+00:00"
  mentions?: User[]
  myReaction: ReactionCounts
  reactions: ReactionCounts
  parentCommentId?: string
  replies: Comment[]
  totalReplies: number
}

export enum CommentableType {
  POST = 'POST',
  DISCUSSION = 'DISCUSSION',
}
