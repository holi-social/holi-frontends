import { User } from '@holi/core/domain/shared/types'
import { Paged } from '@holi/core/types'

export enum ReactionType {
  HEART = 'HEART',
}

export enum ReactionAction {
  SET = 'SET',
  REMOVE = 'REMOVE',
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
  reactors: Paged<User>
  totalReplies: number
  language?: string
}

export enum CommentableType {
  POST = 'POST',
  DISCUSSION = 'DISCUSSION',
  FEED_POST = 'FEED_POST',
}
