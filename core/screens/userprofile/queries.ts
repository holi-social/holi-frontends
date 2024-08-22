import { gql } from '@apollo/client/core'
import { z } from 'zod'

import type {
  AuthenticatedUser,
  SDG,
  Skill,
  Topic,
  UpdateConnectionWithUserActions,
  User,
} from '@holi/core/screens/userprofile/types'
import type { Paged } from '@holi/core/types'

// This fragment is used in a lot of places throughout the app
// Do NOT add anymore fields here that are not required for HoliAvatar
export const UserAvatarFragment = gql`
  fragment UserAvatar on User {
    id
    avatar
    avatarBlurhash
    avatarLabel
    avatarDefaultColor
    firstName
    fullName
  }
`

export const FullUserAvatarFragment = gql`
  fragment FullUserAvatar on User {
    id
    avatar
    avatarBlurhash
    avatarLabel
    avatarDefaultColor
    firstName
    fullName
    role
  }
`

export const FullUserFragment = gql`
  fragment FullUser on User {
    id
    identity
    avatar
    avatarBlurhash
    avatarDefaultColor
    avatarLabel
    fullName
    firstName
    lastName
    aboutMe
    pronouns
    location
    role
    geolocationId
    engagementLevel
    interests {
      id
      title
      slug
    }
    sdgs {
      id
      title
      slug
    }
    skills {
      id
      title
      slug
    }
    connectionStatusToMyself
  }
`

export const FullAuthenticatedUserFragment = gql`
  fragment FullAuthenticatedUser on AuthenticatedUser {
    id
    identity
    avatar
    avatarBlurhash
    avatarDefaultColor
    avatarLabel
    fullName
    firstName
    lastName
    aboutMe
    pronouns
    location
    role
    geolocationId
    engagementLevel
    interests {
      id
      title
      slug
    }
    sdgs {
      id
      title
      slug
    }
    skills {
      id
      title
      slug
    }
    connectionStatusToMyself
    trackingConsentAnalytics
    trackingConsentPersonalization
    isEmployee
  }
`

export const authenticatedUserV2Query = gql`
  ${FullAuthenticatedUserFragment}

  query AuthenticatedUser {
    authenticatedUserV2 {
      ...FullAuthenticatedUser
    }
  }
`

export type AuthenticatedUserV2Response = {
  authenticatedUserV2: AuthenticatedUser & {
    __typename: 'AuthenticatedUser'
  }
}

export type AuthenticatedUserV2Variables = {
  userId: string | undefined
}

export interface UserByIdResponse {
  userById: User
}

export const userByIdQuery = gql`
  ${FullUserFragment}

  query UserById($userId: UUID!) {
    userById(id: $userId) {
      ...FullUser
    }
  }
`

export const userByNameQuery = gql`
  ${UserAvatarFragment}
  query UserByName($substring: String!, $limit: Int!, $offset: Int!) {
    userByName(substring: $substring, limit: $limit, offset: $offset) {
      data {
        ...UserAvatar
        identity
      }
      totalResults
    }
  }
`

export type UserByNameResponse = {
  userByName: Paged<User>
}

export const usersByChatIdentitiesQuery = gql`
  ${UserAvatarFragment}
  query UsersByChatIdentities($identities: [String!]!, $limit: Int!, $offset: Int!) {
    usersByChatIdentities(identities: $identities, limit: $limit, offset: $offset) {
      data {
        ...UserAvatar
        identity
        pronouns
      }
    }
  }
`

export type UsersByChatIdentitiesQueryVariables = {
  identities: string[]
  offset: number
  limit: number
}

export type UsersByChatIdentitiesResponse = {
  usersByChatIdentities: Paged<User>
}

export const UpdateAuthenticatedUserInputSchema = z.object({
  avatar: z.instanceof(Object).optional(),
  firstName: z
    .string()
    .min(2, { message: 'minCharacters---2' })
    .max(100, { message: 'maxCharacters---100' })
    .optional(),
  lastName: z.string().max(100, { message: 'maxCharacters---100' }).optional(),
  aboutMe: z.string().max(3000, { message: 'maxCharacters---3000' }).optional(),
  pronouns: z.string().max(192, { message: 'maxCharacters---192' }).optional(),
  location: z.string().max(192, { message: 'maxCharacters---192' }).optional(),
  geolocation: z.instanceof(Object).optional(),
  engagementLevel: z.string().optional(),
  interests: z.array(z.string() /* UUID */).optional(),
  sdgs: z.array(z.string() /* UUID */).optional(),
  skills: z.array(z.string() /* UUID */).optional(),
  trackingConsentAnalytics: z.boolean().optional().nullable(),
  trackingConsentPersonalization: z.boolean().optional().nullable(),
})

export type UpdateAuthenticatedUserInput = z.infer<typeof UpdateAuthenticatedUserInputSchema>

export type UpdateAuthenticatedUserV2Response = {
  updateAuthenticatedUserV2: AuthenticatedUser & {
    __typename: 'AuthenticatedUser'
  }
}

export type UpdateConnectionWithUserInput = {
  userId: string
  action: UpdateConnectionWithUserActions
}

export type UpdateConnectionWithUserResponse = {
  updateConnectionWithUser: User
}

export const updateAuthenticatedUserV2Mutation = gql`
  ${FullAuthenticatedUserFragment}

  mutation UpdateAuthenticatedUser($input: UpdateAuthenticatedUserInput!) {
    updateAuthenticatedUserV2(input: $input) {
      ...FullAuthenticatedUser
    }
  }
`

export const updateConnectionWithUserMutation = gql`
  ${FullUserFragment}

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
