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
  links?: Link[]
  mentions?: User[]
}

export interface Comment {
  id: string
  text: string
  creator: User
  created?: string // "2022-10-06T17:50:41.661594+00:00"
  mentions?: User[]
}

export interface Link {
  requestedUrl: string
  url: string
  title: string
  description: string
  type: string
  image: string
  siteName: string
  origin: string
}
