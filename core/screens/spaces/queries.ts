import { gql } from '@apollo/client/core'

import { Space } from '@holi/core/screens/spaces/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { Paged } from '@holi/core/types'

const SpaceMemberFragment = gql`
  ${userAvatarFragment}
  fragment FullSpaceMember on SpaceMember {
    user {
      ...UserAvatar
    }
    isAdministrator
  }
`

const SpaceFragment = gql`
  ${SpaceMemberFragment}
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
        slug
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
        isDiscoverSpacesDefault
        slug
      }
    }
  }
`

export const spacesQuery = gql`
  ${SpaceFragment}

  query Spaces($topicSlug: String, $location: String, $skillSlugs: [String], $offset: Int, $limit: Int) {
    spaces(topicSlug: $topicSlug, location: $location, skillSlugs: $skillSlugs, offset: $offset, limit: $limit) {
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

export const discoverSpacesQuery = gql`
  ${SpaceFragment}

  query Spaces($topicIds: [UUID], $location: String, $skillIds: [UUID], $offset: Int, $limit: Int) {
    discoverSpaces(topicIds: $topicIds, location: $location, skillIds: $skillIds, offset: $offset, limit: $limit) {
      topicId
      location
      skillId
      spaces {
        totalResults
        data {
          ...FullSpace
        }
      }
    }
  }
`

export type DiscoverSpacesGroup = {
  topicId?: string
  location?: string
  skillId?: string
  spaces: Paged<Space>
}

export type DiscoverSpacesResponse = {
  discoverSpaces: DiscoverSpacesGroup[]
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

export const joinSpaceMutation = gql`
  ${SpaceFragment}

  mutation UpdateSpaceUserConnection(
    $connectAction: UpdateConnectionAction!
    $connectionType: SpaceUserConnectionType!
    $spaceId: UUID!
    $userId: UUID
  ) {
    updateSpaceUserConnection(
      connectAction: $connectAction
      connectionType: $connectionType
      spaceId: $spaceId
      userId: $userId
    ) {
      ...FullSpace
    }
  }
`

export type JoinSpaceResponse = {
  updateSpaceUserConnection: Space
}
