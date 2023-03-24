import { gql } from '@apollo/client/core'
import { z } from 'zod'

import { memberSpacesFragment } from '@holi/core/queries'
import type { SDG, Skill, Topic, UpdateConnectionWithUserActions, User } from '@holi/core/screens/userprofile/types'
import type { MemberSpaces, Paged } from '@holi/core/types'

export const userAvatarFragment = gql`
  fragment UserAvatar on User {
    id
    avatar
    avatarLabel
    avatarDefaultColor
    fullName
    aboutMe
  }
`

export const userFragment = gql`
  fragment FullUser on User {
    id
    avatar
    fullName
    firstName
    lastName
    aboutMe
    pronouns
    location
    geolocation {
      latitude
      longitude
    }
    avatarDefaultColor
    avatarLabel
    engagementLevel
    interests {
      id
      title
    }
    sdgs {
      id
      title
    }
    skills {
      id
      title
    }
    connectionStatusToMyself
  }
`

export const authenticatedUserQuery = gql`
  ${userFragment}

  query AuthenticatedUser {
    authenticatedUser {
      ...FullUser
    }
  }
`

export type AuthenticatedUserResponse = {
  authenticatedUser: User
}

export interface UserByIdResponse {
  userById: User
}

export const userByIdQuery = gql`
  ${userFragment}

  query UserById($userId: UUID!) {
    userById(id: $userId) {
      ...FullUser
    }
  }
`

export interface UserbyIdWithSpacesResponse {
  userById: User
  spaces: MemberSpaces
}

export const userByIdWithSpacesQuery = gql`
  ${userFragment}
  ${memberSpacesFragment}

  query UserByIdWithSpaces($userId: UUID!) {
    userById(id: $userId) {
      ...FullUser
    }
    spaces(memberId: $userId) {
      ...MemberSpaces
    }
  }
`

export const userByNameQuery = gql`
  ${userAvatarFragment}
  query UserByName($substring: String!, $limit: Int, $offset: Int) {
    userByName(substring: $substring, limit: $limit, offset: $offset) {
      data {
        ...UserAvatar
      }
    }
  }
`

export type UserByNameResponse = {
  userByName: Paged<User>
}

export const UpdateAuthenticatedUserInputSchema = z.object({
  avatar: z.instanceof(Object).optional(),
  firstName: z.string().min(2, { message: 'minCharacters---2' }).max(192, { message: 'maxCharacters---192' }),
  lastName: z.string().max(192, { message: 'maxCharacters---192' }).optional(),
  aboutMe: z.string().max(3000, { message: 'maxCharacters---3000' }).optional(),
  pronouns: z.string().max(192, { message: 'maxCharacters---192' }).optional(),
  location: z.string().max(192, { message: 'maxCharacters---192' }).optional(),
  geolocation: z
    .object({
      latitude: z.number().optional(),
      longiture: z.number().optional(),
    })
    .optional(),
  engagementLevel: z.string().optional(),
  interests: z.array(z.string() /* UUID */).optional(),
  sdgs: z.array(z.string() /* UUID */).optional(),
  skills: z.array(z.string() /* UUID */).optional(),
})

export type UpdateAuthenticatedUserInput = z.infer<typeof UpdateAuthenticatedUserInputSchema>

export type UpdateAuthenticatedUserResponse = {
  updateAuthenticatedUser: User
}

export type UpdateConnectionWithUserInput = {
  userId: string
  action: UpdateConnectionWithUserActions
}

export type UpdateConnectionWithUserResponse = {
  updateConnectionWithUser: User
}

export const updateUserMutation = gql`
  ${userFragment}

  mutation UpdateAuthenticatedUser($input: UpdateAuthenticatedUserInput!) {
    updateAuthenticatedUser(input: $input) {
      ...FullUser
    }
  }
`

export const updateConnectionWithUserMutation = gql`
  ${userFragment}

  mutation UpdateConnectionWithUser($input: UpdateConnectionWithUserInput!) {
    updateConnectionWithUser(input: $input) {
      ...FullUser
    }
  }
`

export const sdgsQuery = gql`
  query SDGs {
    sdgs {
      data {
        id
        title
      }
    }
  }
`

export const skillsQuery = gql`
  query Skills {
    skills {
      data {
        id
        title
        slug
      }
    }
  }
`

export const interestsQuery = gql`
  query Topics {
    interests: topics {
      data {
        id
        title
        slug
      }
    }
  }
`

export interface TopicsQueryResult {
  topics: Paged<Topic>
}

export interface SkillsQueryResult {
  skills: Paged<Skill>
}

export interface SdgsQueryResult {
  sdgs: Paged<SDG>
}

export type DeleteAuthenticatedUserResponse = {
  success: boolean
}

export const deleteAuthenticatedUserMutation = gql`
  mutation DeleteAuthenticatedUser {
    deleteAuthenticatedUser {
      success
    }
  }
`
