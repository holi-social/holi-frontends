import { Post } from 'core/screens/posts/types'
import { User } from 'core/screens/userprofile/types'

export interface Insight {
  id: string
  title: string
  description: string
  datePublished: string
  curator: Partial<User>
  headerImage: string
  posts: Post[]
}
