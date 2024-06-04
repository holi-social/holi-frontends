import { gql } from '@apollo/client/core'

import { Poll } from '@holi/core/screens/polls/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'

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
