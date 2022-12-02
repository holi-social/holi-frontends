import { gql } from '@apollo/client/core'

import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'

export type NumberOfItems = {
  numberOfItems: number
}

export const userSuggestionsQuery = gql`
  ${userAvatarFragment}

  query UserSuggestions($limit: Int!) {
    userSuggestions(limit: $limit) {
      data {
        ...UserAvatar
      }
    }
  }
`

export type UserSuggestionsResponse = {
  userSuggestions: {
    data: User[]
  }
}
