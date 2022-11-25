import { gql } from '@apollo/client/core'

import { Space } from '@holi/core/screens/spaces/types'
import { userFragment } from '@holi/core/screens/userprofile/queries'

const SpaceMemberFragment = gql`
  fragment FullSpaceMember on SpaceMember {
    id
    user {
      id
      avatar
      firstName
      lastName
      aboutMe
      avatarDefaultColor
      avatarLabel
    }
    isAdministrator
    isModerator
    created
  }
`

const SpaceFragment = gql`
  fragment FullSpace on Space {
    id
    title
    description
    created
    avatar
    creator {
      ...FullUser
    }
    mainImage
    location
    memberships {
      ...FullSpaceMember
    }
    tasks {
      id
      name
      description
      creator {
        ...FullUser
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
  ${userFragment}
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
  ${userFragment}
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
