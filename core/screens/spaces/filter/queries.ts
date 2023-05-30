import { gql } from '@apollo/client'

import { SpaceOverviewFragment } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { Paged } from '@holi/core/types'

export const spacesQuery = gql`
  ${SpaceOverviewFragment}

  query Spaces($topicSlug: String, $geolocation: GeoJSON, $skillSlugs: [String], $offset: Int, $limit: Int) {
    spaces(topicSlug: $topicSlug, geolocation: $geolocation, skillSlugs: $skillSlugs, offset: $offset, limit: $limit) {
      totalResults
      data {
        ...OverviewSpace
      }
    }
  }
`

export type SpacesResponse = {
  spaces: Paged<Space>
}
