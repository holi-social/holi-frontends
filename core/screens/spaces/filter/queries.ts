import { gql } from '@apollo/client'

import { SpaceFragment } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { Paged } from '@holi/core/types'

export const spacesQuery = gql`
  ${SpaceFragment}

  query Spaces($topicSlug: String, $geolocation: GeoJSON, $skillSlugs: [String], $offset: Int, $limit: Int) {
    spaces(topicSlug: $topicSlug, geolocation: $geolocation, skillSlugs: $skillSlugs, offset: $offset, limit: $limit) {
      totalResults
      data {
        ...FullSpace
      }
    }
  }
`

export type SpacesResponse = {
  spaces: Paged<Space>
}
