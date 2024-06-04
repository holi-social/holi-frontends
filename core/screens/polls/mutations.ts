import { gql } from '@apollo/client/core'

import { Poll } from '@holi/core/screens/polls/types'

export const updateVotesMutation = gql`
  mutation UpdateVotes($id: UUID!) {
    updateVotes(id: $id) {
      choiceText
      id
      votes
    }
  }
`

export type UpdatePollResponse = {
  updatePoll: Poll
}
