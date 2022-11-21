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
    fullName
    avatarDefaultColor
    avatarLabel
  }

  query UserSuggestions($limit: Int!) {
    userSuggestions(limit: $limit) {
      data {
        ...UserSuggestion
      }
    }
  }
`

export type UserSuggestionsResponse = {
  userSuggestions: {
    data: User[]
  }
}
