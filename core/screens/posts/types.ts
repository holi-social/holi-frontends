import { Comment } from '@holi/core/screens/posts/types'
import { User } from '@holi/core/screens/userprofile/types'

export interface Post {
  id: string
  text: string
  creator: User
  title: string
  created?: string // "2022-10-06T17:50:41.661594+00:00"
  modified?: string // "2022-10-06T17:50:41.661594+00:00"
  commentsEnabled?: boolean
  publicReactions?: boolean
  isEdited?: boolean
  isClosed?: boolean
  isDeleted?: boolean
  comments?: Comment[]
  status?: string // 'P'
  mediaWidth?: number
  mediaHeight?: number
  mediaThumbnail?: string // "posts/8cf625cc-670c-4a79-875c-44fd7a6dbf47/fedd0ef0-2f7e-402c-ab6c-523e135acaef.jpg"
}

export interface Comment {
  id: string
  text: string
  creator: User
  created?: string // "2022-10-06T17:50:41.661594+00:00"
}
