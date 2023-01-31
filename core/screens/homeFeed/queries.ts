import { gql } from '@apollo/client/core'

import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

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
  userSuggestions: Paged<User>
}
