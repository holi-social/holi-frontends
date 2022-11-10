import { User } from 'core/screens/userprofile/types'

export interface Comment {
  id: string
  text: string
  commenter: User
  created?: string // "2022-10-06T17:50:41.661594+00:00"
}
