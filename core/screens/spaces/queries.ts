import { gql } from '@apollo/client/core'

import { Space } from '@holi/core/screens/spaces/types'

const SpaceMemberFragment = gql`
  fragment SpaceMember on User {
    id
    avatar
    firstName
    lastName
    fullName
    avatarDefaultColor
    avatarLabel
    isAdmin @client
  }
`

const SpaceFragment = gql`
  fragment FullSpace on Space {
    id
    title
    description
    created
    avatar @client
    creator {
      ...SpaceMember
    }
    mainImage
    location
    members {
      ...SpaceMember
    }
    tasks {
      id
      name
      description
      creator {
        ...SpaceMember
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

export const topicsQuery = gql`
  query Topics {
    topics {
      data {
        id
        title
      }
    }
  }
`

export const spacesQuery = gql`
  ${SpaceFragment}
  ${SpaceMemberFragment}

  query Spaces($topicId: UUID, $location: String, $offset: Int, $limit: Int) {
    spaces(topicId: $topicId, location: $location, offset: $offset, limit: $limit) {
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
  ${SpaceMemberFragment}

  query SpaceById($id: String!) {
    spaceById(id: $id) {
      ...FullSpace
    }
  }
`

export type SpaceByIdResponse = {
  spaceById: Space
}
