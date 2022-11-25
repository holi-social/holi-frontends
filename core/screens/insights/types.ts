import { Post } from '@holi/core/screens/posts/types'
import { Topic, User } from '@holi/core/screens/userprofile/types'

export interface Insight {
  id: string
  title: string
  description: string
  datePublished: string
  creator: User
  headerImage: string
  topic: Topic
  posts: Post[]
}
