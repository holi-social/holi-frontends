import { gql } from '@apollo/client/core'

import { SpaceOverviewFragment } from '@holi/core/screens/spaces/queries'
import type { Space, SpaceSection } from '@holi/core/screens/spaces/types'
import type { GeolocationGeoJSON, Paged } from '@holi/core/types'

// reminder: when adding parameters, also add them to `keyArgs` in cache config
export const discoverSpacesQuery = gql`
  ${SpaceOverviewFragment}

  query DiscoverSpaces($topicIds: [UUID], $geolocation: GeoJSON, $skillIds: [UUID], $offset: Int!, $limit: Int!) {
    discoverSpaces(
      topicIds: $topicIds
      geolocation: $geolocation
      skillIds: $skillIds
      offset: $offset
      limit: $limit
    ) {
      topicId
      locationId
      skillId
      spaces {
        totalResults
        data {
          ...SpaceOverview
        }
      }
    }
  }
`

export type DiscoverSpacesVariables = {
  topicIds: string[]
  skillIds: string[]
  geolocation?: GeolocationGeoJSON
  offset: number
  limit: number
}

export type DiscoverSpacesGroup = {
  topicId?: string
  locationId?: string
  skillId?: string
  spaces: Paged<Space>
}

export type DiscoverSpacesData = {
  discoverSpaces: DiscoverSpacesGroup[]
}

export const mySpaceQuery = gql`
  ${SpaceOverviewFragment}

  query MySpaces {
    mySpaces {
      section
      type
      spaces {
        totalResults
        data {
          ...SpaceOverview
        }
      }
    }
  }
`
export type MySpacesResponse = {
  mySpaces: SpaceSection[]
}
