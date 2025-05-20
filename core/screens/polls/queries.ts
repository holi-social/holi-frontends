import { gql } from '@apollo/client/core'

import { UserAvatarFragment } from '@holi/core/domain/shared/queries'
import { Poll } from '@holi/core/screens/polls/types'

export const PollFragment = gql`
  ${UserAvatarFragment}

  fragment PollFragment on Poll {
    id
    modified
    questionText
    creator {
      ...UserAvatar
    }
    choices {
      id
      votes
      choiceText
    }
    isMultiSelect
    maxChoices
  }
`

export const PollWithChoices = gql`
  ${PollFragment}

  query PollWithChoices($id: UUID!) {
    pollById(id: $id) {
      ...PollFragment
    }
  }
`

export const userHasVotedByPollId = gql`
  query userHasVotedByPollId($id: UUID!) {
    userHasVotedByPollId(id: $id)
  }
`

export type PollWithChoicesResponse = {
  pollWithChoices: Poll
}
