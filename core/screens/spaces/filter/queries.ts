import { gql } from '@apollo/client'

import { SpaceOverviewFragment } from '@holi/core/screens/spaces/queries'
import type { Space } from '@holi/core/screens/spaces/types'
import type { Paged } from '@holi/core/types'

// reminder: when adding parameters, also add them to `keyArgs` in cache config
export const spacesQuery = gql`
  ${SpaceOverviewFragment}

  query Spaces(
    $topicsV2: [String!]
    $geolocation: GeoJSON
    $skillsV2: [String!]
    $offset: Int! = 0
    $limit: Int! = 12
  ) {
    spaces(
      topicsV2: $topicsV2
      geolocation: $geolocation
      skillsV2: $skillsV2
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
