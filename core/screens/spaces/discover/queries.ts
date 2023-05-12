import { gql } from '@apollo/client/core'

import { SpaceMemberFragment } from '@holi/core/screens/spaces/queries'
import type { Space, SpaceSection } from '@holi/core/screens/spaces/types'
import type { Paged } from '@holi/core/types'

const SpaceOverviewFragment = gql`
  ${SpaceMemberFragment}
  fragment OverviewSpace on Space {
    id
    title
    description
    created
    cover
    location
    avatar
    avatarDefaultColor
    name
    members {
      ...FullSpaceMember
    }
  }
`

export const discoverSpacesQuery = gql`
  ${SpaceOverviewFragment}

  query DiscoverSpaces($topicIds: [UUID], $geolocation: GeoJSON, $skillIds: [UUID], $offset: Int, $limit: Int) {
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
          ...OverviewSpace
        }
      }
    }
  }
`

export type DiscoverSpacesGroup = {
  topicId?: string
  locationId?: string
  skillId?: string
  spaces: Paged<Space>
}

export type DiscoverSpacesResponse = {
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
          ...OverviewSpace
        }
      }
    }
  }
`
export type MySpacesResponse = {
  mySpaces: SpaceSection[]
}
