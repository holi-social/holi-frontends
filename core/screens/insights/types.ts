import { Link, Post } from '@holi/core/screens/posts/types'
import { Topic, User } from '@holi/core/screens/userprofile/types'
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
}

export interface Insight {
  id: string
  title: string
  description: string
  datePublished: string
  creator: User
  headerImage: string
  headerImageBlurhash?: string
  topic: Topic
  posts: Post[]
  numberOfPosts: number
  involvedUsers: Paged<User>
  quotes: Quote[]
  isBookmarked?: boolean
  recommendations?: Recommendation[]
}

export interface Recommendation {
  id: string
  category: string
  link: string
  linkPreview: Link
  comment: string
  insight?: Insight
}
