import { gql } from '@apollo/client/core'

import { Poll } from '@holi/core/screens/polls/types'

export const updateVotesMutation = gql`
  mutation UpdateVotes($id: UUID!) {
    updateVotes(id: $id) {
      id
    }
  }
`

export type UpdatePollResponse = {
  updatePoll: Poll
}
