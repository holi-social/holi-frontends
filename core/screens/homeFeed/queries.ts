import { gql } from '@apollo/client/core'

import { userFragment } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'

export const userSuggestionsQuery = gql`
  ${userFragment}

  query UserSuggestions {
    userSuggestions {
      ...FullUser
    }
  }
`

export type UserSuggestionsResponse = {
  userSuggestions: User[]
}
