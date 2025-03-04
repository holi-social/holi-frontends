import { gql } from '@apollo/client/core'

import { SpaceOverviewFragment } from '@holi/core/screens/spaces/queries'
import type { Space, SpaceSection } from '@holi/core/screens/spaces/types'
import type { GeolocationGeoJSON, Paged } from '@holi/core/types'

// reminder: when adding parameters, also add them to `keyArgs` in cache config
export const discoverSpacesQuery = gql`
  ${SpaceOverviewFragment}

  query DiscoverSpaces(
    $topicsV2: [String!]
    $geolocation: GeoJSON
    $skillsV2: [String!]
    $offset: Int! = 0
    $limit: Int! = 5
  ) {
    discoverSpaces(
      topicsV2: $topicsV2
      geolocation: $geolocation
      skillsV2: $skillsV2
      offset: $offset
      limit: $limit
    ) {
      topicV2
      locationId
      skillV2
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
  topicsV2?: string[]
  skillsV2?: string[]
  geolocation?: GeolocationGeoJSON
  offset: number
  limit: number
}

export type DiscoverSpacesGroup = {
  topicV2?: string
  locationId?: string
  skillV2?: string
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

export const discoverSpacesDefaultTopicsV2 = gql`
  query {
    discoverSpacesDefaultTopicsV2
  }
`

export type DiscoverSpacesDefaultTopicsVResponse = {
  discoverSpacesDefaultTopicsV2: string[]
}
