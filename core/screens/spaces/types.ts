import { User } from 'core/screens/userprofile/types'

export type SortedSpaces = {
  id: number
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

export type SpacesResponseProps = {
  filter: {
    topics: string[]
    location?: string
  }
  matchedSpaces: SortedSpaces[]
  unmatchedSpaces: SortedSpaces[]
}
