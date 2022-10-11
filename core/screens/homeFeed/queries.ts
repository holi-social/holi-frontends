import { gql } from '@apollo/client/core'

import { User } from '@holi/core/screens/userprofile/types'

export type NumberOfItems = {
  numberOfItems: number
}

export const userSuggestionsQuery = gql`
  fragment UserSuggestion on User {
    id
    avatar
    firstName
    lastName
    avatarDefaultColor
    avatarLabel
  }

  query UserSuggestions($numberOfItems: Int!) {
    userSuggestions(numberOfItems: $numberOfItems) {
      ...UserSuggestion
    }
  }
`

export type UserSuggestionsResponse = {
  userSuggestions: User[]
}
