import { Term, User } from '@holi/core/screens/userprofile/types'

export interface Space {
  id: string
  title: string
  description: string
  created: string
  creator: User
  mainImage: string
  location: string
  members: User[]
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
  skills: Term[]
}
