import { Topic, User } from '@holi/core/domain/shared/types'
import { Poll } from '@holi/core/screens/polls/types'
import { Link, Post } from '@holi/core/screens/posts/types'
import { Paged } from '@holi/core/types'

export enum ExternalContentCategory {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  POST = 'POST',
  STUDY = 'STUDY',
  DONATION_PROJECT = 'DONATION_PROJECT',
  VOLUNTEERING = 'VOLUNTEERING',
  TIP = 'TIP',
  SPACE = 'SPACE',
  EVENT = 'EVENT',
}

export interface Quote {
  id: string
  text: string
  author: string
  authorProfession: string
  link: string
  linkPreview: Link
  category: ExternalContentCategory
  comment: string
  reactions: ReactionCounts
  myReaction: ReactionCounts
}

export interface Insight {
  id: string
  title: string
  description: string
  datePublished: string
  creator?: User
  headerImage: string
  headerImageBlurhash?: string
  topic: Topic
  posts: Post[]
  polls: Poll[]
  numberOfPosts: number
  involvedUsers: Paged<User>
  quotes: Quote[]
  isFavorite?: boolean
  recommendations?: Recommendation[]
  initiatives?: Initiative[]
  discussions?: Discussion[]
}

export interface InsightWithQuote extends Insight {
  quote: Quote
}

export interface Recommendation {
  id: string
  category: ExternalContentCategory
  link: string
  linkPreview: Link
  comment: string
  reactions: ReactionCounts
  myReaction: ReactionCounts
}

export interface ReactionCounts {
  HEART: number
}

export interface Initiative {
  id: string
  category: ExternalContentCategory
  link: string
  linkPreview: Link
  reactions: ReactionCounts
  myReaction: ReactionCounts
  comment: string
}

export interface Discussion {
  id: string
  question: string
}
