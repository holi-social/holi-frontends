import { gql } from '@apollo/client/core'

import { Space } from '@holi/core/screens/spaces/types'

const UserAvatarFragment = gql`
  fragment UserAvatar on User {
    id
    avatar
    firstName
    lastName
    fullName
    avatarDefaultColor
    avatarLabel
  }
`

const SpaceFragment = gql`
  fragment FullSpace on Space {
    id
    title
    description
    created
    creator {
      ...UserAvatar
    }
    mainImage
    location
    members {
      ...UserAvatar
    }
    tasks {
      id
      name
      description
      creator {
        ...UserAvatar
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
  ${UserAvatarFragment}

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
  ${UserAvatarFragment}

  query SpaceById($id: String!) {
    spaceById(id: $id) {
      ...FullSpace
    }
  }
`

export type SpaceByIdResponse = {
  spaceById: Space
}
