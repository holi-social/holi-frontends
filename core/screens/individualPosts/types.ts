import { Term, Topic, User } from '@holi/core/screens/userprofile/types'

export enum VisibilityLevel {
  PUBLIC = 'PUBLIC',
  REGISTERED_USERS_ONLY = 'REGISTERED_USERS_ONLY',
}

export type Category = Term

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

export interface FeedPost {
  id: string
  title: string
  description: string
  image?: string
  visibility: VisibilityLevel
  topics?: Topic[]
  category: Category
  creator: User
  createdAt: string
  imageBlurhash?: string
  reactions: ReactionCounts
  myReaction: ReactionCounts
}
