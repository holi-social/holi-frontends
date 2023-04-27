import { gql } from '@apollo/client/core'
import { z } from 'zod'

import { memberSpacesFragment } from '@holi/core/queries'
import { LinkFragment, PostImageFragment } from '@holi/core/screens/posts/queries'
import type { Space, SpaceCollaborationTool, SpaceSection, Task } from '@holi/core/screens/spaces/types'
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
    contactEmail
    contactPhone
    contactDescription
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
      type
      url
    }
    collaborationTools {
      id
      domain
      url
      description
      title
      collectionType
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
      visibility
      locationType
      contactEmail
      contactPhone
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
    avatar
    avatarDefaultColor
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

export const updateSpaceUserConnectionMutation = gql`
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
      id
      connectionStatusToMyself
    }
  }
`

export type UpdateSpaceUserConnectionResponse = {
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

export const AddCollaborationToolSchema = z.object({
  url: z.string().url().max(500).optional(),
  title: z.string().trim().min(3).max(50).optional(),
  description: z.string().trim().min(3).max(100).optional(),
  spaceId: z.string() /* UUID */,
  collectionType: z.string() /* UUID */,
  thumbnail: z.instanceof(Object).optional(),
})

export type AddCollaborationToolInput = z.infer<typeof AddCollaborationToolSchema>

export const addCollaborationToolMutation = gql`
  mutation AddCollaborationTool($input: AddCollaborationToolInput!) {
    addCollaborationTool(input: $input) {
      id
      url
      title
      domain
      description
      collectionType
    }
  }
`

export type AddCollaborationToolResponse = {
  addCollaborationTool: SpaceCollaborationTool
}

export const UpdateCollaborationToolSchema = z.object({
  id: z.string() /* UUID */,
  url: z.string().url().max(500).optional(),
  title: z.string().trim().min(3).max(50).optional(),
  description: z.string().trim().min(3).max(100).optional(),
  collectionType: z.string(),
  thumbnail: z.instanceof(Object).optional(),
})

export type UpdateCollaborationToolInput = z.infer<typeof UpdateCollaborationToolSchema>

export type UpdateCollaborationToolResponse = {
  updateCollaborationTool: SpaceCollaborationTool
}

export const updateCollaborationToolMutation = gql`
  mutation UpdateCollaborationTool($input: UpdateCollaborationToolInput!) {
    updateCollaborationTool(input: $input) {
      id
      url
      title
      description
      collectionType
    }
  }
`

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
  contactDescription: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
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
      contactDescription
      contactEmail
      contactPhone
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

export const CreateTaskSchema = z.object({
  spaceId: z.string() /* UUID */,
  visibility: z.string() /* VisibilityType */,
  name: z.string().min(2).max(128).optional(),
  description: z.string().trim().max(1200).optional(),
  locationType: z.string() /* LocationType */,
  regularity: z.string() /* Regularity */,
  contactEmail: z.string().email().optional(),
  location: z.string().optional(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  contactPhone: z.string().optional(),
  thumbnail: z.instanceof(Object).optional(),
})

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>

export const createTaskMutation = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      name
      description
      visibility
      regularity
      locationType
      location
      contactEmail
      contactPhone
    }
  }
`

export type CreateTaskResponse = {
  createTask: Task
}

export interface DeleteTaskResponse {
  success: boolean
}

export const deleteTaskMutation = gql`
  mutation DeleteTask($id: UUID!) {
    deleteTask(id: $id) {
      success
    }
  }
`

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

export interface DeleteCollaborationToolResponse {
  success: boolean
}

export const deleteCollaborationToolMutation = gql`
  mutation DeleteCollaborationTool($id: UUID!) {
    deleteCollaborationTool(id: $id) {
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

export const SpaceUpdatePostFragment = gql`
  ${userAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment SpaceUpdatePostFragment on Post {
    id
    title
    text
    created
    creator {
      ...UserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...UserAvatar
      }
    }
    image {
      ...PostImageData
    }
    links {
      ...LinkFragment
    }
    mentions {
      id
      fullName
    }
    myReaction {
      HEART
    }
    reactions {
      HEART
    }
    isPublic
  }
`

export const spacePostsQuery = gql`
  ${SpaceUpdatePostFragment}
  query SpaceById($idOrName: String!, $offset: Int!, $limit: Int!, $visibility: VisibilityFilter!) {
    spaceById(idOrName: $idOrName) {
      id
      posts(offset: $offset, limit: $limit, visibility: $visibility) {
        data {
          ...SpaceUpdatePostFragment
        }
      }
    }
  }
`
