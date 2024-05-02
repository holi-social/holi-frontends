import { Term, Topic } from '@holi/core/screens/userprofile/types'

export enum VisibilityLevel {
  PUBLIC = 'PUBLIC',
  REGISTERED_USERS_ONLY = 'REGISTERED_USERS_ONLY',
}

export type Category = Term

export interface FeedPost {
  title: string
  description: string
  image?: string
  visibility: VisibilityLevel
  topics?: Topic[]
  category: Category
  createdAt: string
  imageBlurhash?: string
}
