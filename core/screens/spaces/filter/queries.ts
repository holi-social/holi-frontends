import { gql } from '@apollo/client'

import { SpaceOverviewFragment } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { Paged } from '@holi/core/types'

// reminder: when adding parameters, also add them to `keyArgs` in cache config
export const spacesQuery = gql`
  ${SpaceOverviewFragment}

  query Spaces(
    $topicSlugs: [String]
    $geolocation: GeoJSON
    $skillSlugs: [String]
    $offset: Int! = 0
    $limit: Int! = 12
  ) {
    spaces(
      topicSlugs: $topicSlugs
      geolocation: $geolocation
      skillSlugs: $skillSlugs
      offset: $offset
      limit: $limit
    ) {
      totalResults
      data {
        ...SpaceOverview
      }
    }
  }
`

export type SpacesResponse = {
  spaces: Paged<Space>
}
