import type { User } from '@holi/core/screens/userprofile/types'

export interface Poll {
  id: string
  modified?: string
  questionText: string
  creator: User
  choices: Choice[]
}

export interface Choice {
  id: string
  choiceText: string
  votes: number
  pollId?: Poll
}
