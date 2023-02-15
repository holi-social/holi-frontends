import { gql } from '@apollo/client/core'
import { z } from 'zod'

import { Space, SpaceSection } from '@holi/core/screens/spaces/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { Paged } from '@holi/core/types'

const SpaceMemberFragment = gql`
  ${userAvatarFragment}
  fragment FullSpaceMember on PagedSpaceMemberList {
    totalResults
    data {
      user {
        ...UserAvatar
      }
      isAdministrator
    }
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
    connectionStatusToMyself
    links {
      type
      url
    }
    members {
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
    topics {
      id
      title
    }
    sdgs {
      id
      title
      number
    }
  }
`

const SpaceOverviewFragment = gql`
  ${SpaceMemberFragment}
  fragment OverviewSpace on Space {
    id
    title
    description
    created
    mainImage
    location
    members {
      ...FullSpaceMember
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

export const sdgsQuery = gql`
  query SDGs {
    sdgs {
      data {
        id
        title
        number
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
  ${SpaceOverviewFragment}

  query DiscoverSpaces($topicIds: [UUID], $location: String, $skillIds: [UUID], $offset: Int, $limit: Int) {
    discoverSpaces(topicIds: $topicIds, location: $location, skillIds: $skillIds, offset: $offset, limit: $limit) {
      topicId
      location
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
  location?: string
  skillId?: string
  spaces: Paged<Space>
}

export type DiscoverSpacesResponse = {
  discoverSpaces: DiscoverSpacesGroup[]
}

export const spaceByIdQuery = gql`
  ${SpaceFragment}

  query SpaceById($id: UUID!) {
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

export const UpdateSpaceInputSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(60).optional(),
  description: z.string().max(600).optional(),
  avatar: z.instanceof(Object).optional(),
  topics: z.array(z.string()).optional(),
  sdgs: z.array(z.string()).optional(),
})

export type UpdateSpaceInput = z.infer<typeof UpdateSpaceInputSchema>

export const updateSpaceMutation = gql`
  mutation UpdateSpace($input: UpdateSpaceInput) {
    updateSpace(input: $input) {
      id
      title
      description
      avatar
      mainImage
      topics {
        id
        title
      }
      sdgs {
        id
        title
        number
      }
    }
  }
`

export type UpdateSpaceResponse = {
  updateSpace: Partial<Space>
}

export type JoinSpaceResponse = {
  updateSpaceUserConnection: Space
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

export type SpaceUserConnectionType = string

export type MySpacesResponse = {
  mySpaces: SpaceSection[]
}
