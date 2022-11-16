import { User } from 'core/screens/userprofile/types'

export type SortedSpaces = {
  id: string
  topic: string
  spaces: Space[]
}
export interface Space {
  id: string
  title: string
  description: string
  created: string
  creator: Partial<User>
  tasks?: Task[]
}

export interface Skill {
  id: string
  title: string
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
