import { Post } from 'core/screens/posts/types'
import { Topic, User } from 'core/screens/userprofile/types'

export interface Insight {
  id: string
  title: string
  description: string
  datePublished: string
  curator: User
  headerImage: string
  topic: Topic
  posts: Post[]
}
