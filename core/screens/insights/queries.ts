import { gql } from '@apollo/client/core'

import { Insight } from '@holi/core/screens/insights/types'

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
