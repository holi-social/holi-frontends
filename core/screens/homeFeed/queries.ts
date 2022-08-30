import { gql } from '@apollo/client/core'

import { userFragment } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'

export type NumberOfItems = {
  numberOfItems: number
}

export const userSuggestionsQuery = gql`
  ${userFragment}

  query UserSuggestions($numberOfItems: Int!) {
    userSuggestions(numberOfItems: $numberOfItems) {
      ...FullUser
    }
  }
`

export type UserSuggestionsResponse = {
  userSuggestions: User[]
}
