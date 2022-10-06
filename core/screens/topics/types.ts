import { User } from 'core/screens/userprofile/types'

export interface Insight {
  id: string
  title: string
  description: string
  datePublished: string
  curator: Partial<User>
  headerImage: string
  posts: { id: string; author?: string; text: string }[]
}
