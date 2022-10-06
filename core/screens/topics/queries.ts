import { gql } from '@apollo/client/core'

import { Insight } from '@holi/core/screens/topics/types'

export const lastInsightsQuery = gql`
{
  lastInsights(numberOfItems: Int!) {
    id
    title
  }
}
`
/*
for reference, here's a full insight query, except for the posts fields
{
  lastInsights(numberOfItems: Int!) {
    id
    title
    description
    datePublished
    curator {
      id
      avatar
    }
    headerImage
    posts {
      id
      text
    }
  }
}
*/

export type LastInsightsResponse = {
  lastInsights: Insight[]
}
