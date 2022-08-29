import { gql } from '@apollo/client/core'

import type { User } from '@holi/core/screens/userprofile/types'
import { userFragment } from '@holi/core/screens/userprofile/queries'

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
