import { Skill, User } from '@holi/core/screens/userprofile/types'

export interface SpaceMember extends User {
  isAdmin: boolean
}

export interface Space {
  id: string
  title: string
  description: string
  created: string
  creator: User
  mainImage: string
  location: string
  members: SpaceMember[]
  avatar?: string
  tasks?: Task[]
}

export interface Task {
  id: string
  name: string
  description: string
  creator: Partial<User>
  slotsAvailable: number
  slotsTaken: number
  location: string
  regularity: 'REGULARLY' | 'PROJECT_BASED' | 'ONE_TIME'
  skills: Skill[]
}
