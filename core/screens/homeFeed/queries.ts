import { gql } from '@apollo/client/core'

import { Insight } from '@holi/core/screens/homeFeed/types'
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

export const lastInsightsQuery = gql`
  query LastInsights($numberOfItems: Int!) {
    lastInsights(numberOfItems: $numberOfItems) {
      id
      title
      description
      datePublished
      curator {
        id
        avatar
        firstName
        lastName
      }
      headerImage
      posts {
        id
        text
        creator {
          id
          firstName
          lastName
        }
      }
    }
  }
`

export type LastInsightsResponse = {
  lastInsights: Insight[]
}
