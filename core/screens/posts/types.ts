import type { User } from '@holi/core/domain/shared/types'
import type { ImageAspectRatio } from '@holi/core/screens/individualPosts/types'
import type { Space } from '@holi/core/screens/spaces/types'
import type { Paged } from '@holi/core/types'

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

export interface PostImage {
  id: string
  url: string
  height: number
  width: number
  imageBlurhash?: string
}

export interface Link {
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

export interface Post {
  __typename: string
  id: string
  text: string
  creator: User
  title: string
  created?: string // "2022-10-06T17:50:41.661594+00:00"
  modified?: string // "2022-10-06T17:50:41.661594+00:00"
  commentsEnabled?: boolean
  publicReactions?: boolean
  isEdited?: boolean
  imageUrls?: string[]
  aspectRatio?: ImageAspectRatio
  isClosed?: boolean
  isDeleted?: boolean
  location?: string
  geolocation?: { latitude: number; longitude: number }
  space?: Space
  status?: string // 'P'
  mediaWidth?: number
  mediaHeight?: number
  mediaThumbnail?: string // "posts/8cf625cc-670c-4a79-875c-44fd7a6dbf47/fedd0ef0-2f7e-402c-ab6c-523e135acaef.jpg"
  image?: PostImage
  links?: Link[]
  mentions?: User[]
  numberOfComments: number
  commenters: Paged<User>
  myReaction: ReactionCounts
  reactions: ReactionCounts
  reactors: Paged<User>
  isPublic?: boolean
  language?: string
}
