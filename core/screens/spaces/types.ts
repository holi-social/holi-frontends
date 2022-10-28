import { User } from 'core/screens/userprofile/types'

export interface Space {
  id: string
  title: string
  description: string
  created: string
  creator: Partial<User>
}
