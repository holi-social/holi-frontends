import type { User } from '@holi/core/domain/shared/types'
import type { GeolocationPoint, Paged } from '@holi/core/types'

export enum VisibilityLevel {
  PUBLIC = 'PUBLIC',
  REGISTERED_USERS_ONLY = 'REGISTERED_USERS_ONLY',
}

interface Term {
  id: string
  title: string
  slug: string
}

export type Category = Term & { idx: number; label?: string }

export enum ReactionType {
  HEART = 'HEART',
}

export enum ReactionAction {
  SET = 'SET',
  REMOVE = 'REMOVE',
}

export enum ImageAspectRatio {
  ONE_ONE = 'ONE_ONE',
  SIXTEEN_NINE = 'SIXTEEN_NINE',
}

export interface ReactionCounts {
  HEART: number
}

interface Link {
  requestedUrl: string
  url: string
  title: string
  description: string
  type: string
  image: string
  siteName: string
  origin: string
  icon?: string
}

export interface FeedPostImage {
  id: string
  image: string
  imageBlurhash: string
  order: number
  altText?: string
  aspectRatio?: ImageAspectRatio
}

export interface FeedPostImageMetadata {
  id: string
  order: number
  altText: string
}

export interface FeedPost {
  __typename: string
  id: string
  slug: string
  title: string
  description: string
  imageUrl?: string
  images?: FeedPostImage[]
  visibility: VisibilityLevel
  location?: string
  geolocation?: GeolocationPoint
  topicsV2?: string[]
  category?: Category
  author: User
  createdAt: string
  imageBlurhash?: string
  reactions: ReactionCounts
  myReaction: ReactionCounts
  linkPreview?: Link
  totalComments: number
  commenters: Paged<User>
  mentionedUsers?: User[]
  language?: string
}
