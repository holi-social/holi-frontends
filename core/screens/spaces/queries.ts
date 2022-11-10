import { gql } from '@apollo/client/core'

import { Space } from '@holi/core/screens/spaces/types'

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
    }
  }
`

export const spacesQuery = gql`
  ${SpaceFragment}

  query Spaces($offset: Int, $limit: Int) {
    spaces(offset: $offset, limit: $limit) {
      ...FullSpace
    }
  }
`

export type SpacesResponse = {
  spaces: Space[]
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
