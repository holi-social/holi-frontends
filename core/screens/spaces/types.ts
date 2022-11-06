import { User } from 'core/screens/userprofile/types'

export interface Space {
  id: string
  title: string
  description: string
  created: string
  creator: Partial<User>
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
}
