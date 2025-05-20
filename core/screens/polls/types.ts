import { User } from '@holi/core/domain/shared/types'

export interface Poll {
  id: string
  modified?: string
  questionText: string
  creator: User
  choices: Choice[]
  isMultiSelect: boolean
  maxChoices: number
}

export interface Choice {
  id: string
  choiceText: string
  votes: number
  pollId?: Poll
}
