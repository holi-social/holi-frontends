import { gql } from '@apollo/client/core'

import { Space } from '@holi/core/screens/spaces/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'

const SpaceMemberFragment = gql`
  fragment FullSpaceMember on SpaceMember {
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
  }
`

const SpaceFragment = gql`
  fragment FullSpace on Space {
    id
    title
    description
    created
    avatar
    mainImage
    location
    links {
      type
      url
    }
    memberships {
      ...FullSpaceMember
    }
    tasks {
      id
      name
      description
      slotsAvailable
      slotsTaken
      location
      regularity
      creator {
        ...UserAvatar
      }
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
  ${userAvatarFragment}
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
  ${userAvatarFragment}
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
