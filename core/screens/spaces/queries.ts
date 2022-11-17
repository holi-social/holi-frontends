import { gql } from '@apollo/client/core'

import { SortedSpaces, Space } from '@holi/core/screens/spaces/types'

const SpaceFragment = gql`
  fragment FullSpace on Space {
    id
    title
    description
    created
    creator {
      id
      avatar
      firstName
      lastName
      aboutMe
    }
    tasks {
      id
      name
      description
      creator {
        id
        avatar
        firstName
        lastName
        avatarDefaultColor
        avatarLabel
      }
      slotsAvailable
      slotsTaken
      location
      regularity
      skills {
        id
        title
      }
    }
  }
`

export const spacesQuery = gql`
  ${SpaceFragment}

  query Spaces($offset: Int, $limit: Int) {
    spaces(offset: $offset, limit: $limit) {
      data {
        ...FullSpace
      }
    }
  }
`

export type SpacesResponse = {
  spaces: {
    data: Space[]
  }
}

export const spaceByIdQuery = gql`
  ${SpaceFragment}

  query SpaceById($id: String!) {
    spaceById(id: $id) {
      ...FullSpace
    }
  }
`

export type SpaceByIdResponse = {
  spaceById: Space
}

// export const filteredSpacesQuery = gql``

export type FilteredSpacesResponse = {
  filter: {
    topics: string[]
    location?: string
  }
  matchedSpaces: SortedSpaces[]
  unmatchedSpaces: SortedSpaces[]
}
