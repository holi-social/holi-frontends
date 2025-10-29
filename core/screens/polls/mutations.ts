import { gql } from '@apollo/client'

export interface VoteOnPollResponse {
  voteOnPoll: boolean
}

export const voteOnPollMutation = gql`
  mutation VoteOnPoll($pollId: UUID!, $choiceIds: [UUID!]!) {
    voteOnPoll(pollId: $pollId, choiceIds: $choiceIds) {
      success
    }
  }
`
