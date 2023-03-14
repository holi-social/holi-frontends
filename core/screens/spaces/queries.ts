import { gql } from '@apollo/client/core'
import { z } from 'zod'

import { memberSpacesFragment } from '@holi/core/queries'
import type { Space, SpaceSection } from '@holi/core/screens/spaces/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import type { MemberSpaces, Paged } from '@holi/core/types'

const SpaceMemberFragment = gql`
  ${userAvatarFragment}
  fragment FullSpaceMember on SpaceMemberPaged {
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
    cover
    name
    avatarDefaultColor
    location
    geolocation {
      latitude
      longitude
    }
    connectionStatusToMyself
    links {
      id
      type
      url
      visibility
      description
      title
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
    cover
    location
    name
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

  query SpaceById($idOrName: String!) {
    spaceById(idOrName: $idOrName) {
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

export const ValidateSpaceInputSchema = z.object({
  title: z.string().trim().min(2).max(60),
  description: z.string().trim().min(1).max(600),
  topics: z.array(z.string() /* UUID */).min(1).max(6).optional(),
  cover: z.instanceof(Object).optional(),
})

export type ValidateSpaceInput = z.infer<typeof ValidateSpaceInputSchema>

export const validateSpaceMutation = gql`
  mutation ValidateSpace($input: ValidateSpaceInput!) {
    validateSpace(input: $input) {
      success
    }
  }
`

export type ValidateSpaceResponse = {
  validateSpace: {
    success: boolean
  }
}

export const CreateSpaceInputSchema = z.object({
  title: z.string().trim().min(2).max(60),
  description: z.string().trim().min(1).max(600),
  topics: z.array(z.string() /* UUID */).min(1).max(6),
  cover: z.instanceof(Object),
})

export type CreateSpaceInput = z.infer<typeof CreateSpaceInputSchema>

export const createSpaceMutation = gql`
  ${SpaceFragment}

  mutation CreateSpace($input: CreateSpaceInput!) {
    createSpace(input: $input) {
      ...FullSpace
    }
  }
`

export const CreateSpaceExternalLinkInputSchema = z.object({
  url: z.string().url().max(500),
  title: z.string().trim().min(2).max(128),
  description: z.string().trim().min(1).max(256).optional(),
  visibility: z.string().trim().min(1).max(256),
  communityId: z.string() /* UUID */,
})

export type CreateSpaceExternalLinkInput = z.infer<typeof CreateSpaceExternalLinkInputSchema>

export const createSpaceExternalLinkMutation = gql`
  ${SpaceFragment}

  mutation CreateSpaceExternalLink($input: CreateSpaceExternalLinkInput!) {
    createSpaceExternalLink(input: $input) {
      ...FullSpace
    }
  }
`

export type CreateSpaceExternalLinkResponse = {
  createSpaceExternalLink: Space
}

export type CreateSpaceResponse = {
  createSpace: Space
}

export const UpdateSpaceInputSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(2).max(60).optional(),
  description: z.string().trim().min(1).max(600).optional(),
  location: z.string().optional(),
  avatar: z.instanceof(Object).optional(),
  topics: z.array(z.string()).optional(),
  sdgs: z.array(z.string()).optional(),
})

export type UpdateSpaceInput = z.infer<typeof UpdateSpaceInputSchema>

export const updateSpaceMutation = gql`
  mutation UpdateSpace($input: UpdateSpaceInput!) {
    updateSpace(input: $input) {
      id
      title
      description
      avatar
      cover
      location
      avatarDefaultColor
      name
      geolocation {
        latitude
        longitude
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
  }
`

export type UpdateSpaceResponse = {
  updateSpace: Partial<Space>
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

export interface DeleteSpaceResponse {
  success: boolean
}

export const deleteSpaceMutation = gql`
  mutation DeleteSpace($id: UUID!) {
    deleteSpace(id: $id) {
      success
    }
  }
`

export interface SpacesByMemberIdResponse {
  spaces: MemberSpaces
}

export const spacesByMemberIdQuery = gql`
  ${memberSpacesFragment}
  query SpacesByMember($memberId: UUID) {
    spaces(memberId: $memberId) {
      ...MemberSpaces
    }
  }
`
