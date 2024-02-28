import { Post } from '@holi/core/screens/posts/types'
import { Topic, User } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

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
  isBookmarked?: boolean
  recommendations?: Recommendation[]
}

export interface LinkPreview {
  id: string
  requestedUrl: string
  url: string
  title: string
  description: string
  type: string
  image: string
  siteName: string
  fetchedAt: string
  origin: string
  icon?: string
}

export interface Recommendation {
  id: string
  category: string
  link: string
  linkPreview: LinkPreview
  comment: string
}
