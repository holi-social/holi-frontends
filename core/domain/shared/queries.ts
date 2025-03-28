import { gql } from '@apollo/client/core'

import { FullUserFragmentDoc } from '@holi/api/graphql/graphql-codegen'
import type { AuthenticatedUser, User } from '@holi/core/domain/shared/types'
import type { Paged } from '@holi/core/types'

// This fragment is used in a lot of places throughout the app
// Do NOT add anymore fields here that are not required for HoliAvatar
export const UserAvatarFragment = gql`
  fragment UserAvatar on User {
    id
    identity
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
    identity
    avatar
    avatarBlurhash
    avatarLabel
    avatarDefaultColor
    firstName
    fullName
    role
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
    interestsV2
    skillsV2
    connectionStatusToMyself
    trackingConsentAnalytics
    trackingConsentPersonalization
    trackingConsentAdPartners
    isEmployee
    email
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

export const userByIdQuery = gql`
  ${FullUserFragmentDoc}

  query UserById($userId: UUID!) {
    userById(id: $userId) {
      ...FullUser
    }
  }
`

export interface UserByIdResponse {
  userById: User
}

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

export type Connection = {
  id: string
  fullName: string
  avatar: string
  avatarBlurhash: string
  avatarDefaultColor: string
  avatarLabel: string
  pronouns: string
  identity: string
}

export const myConnectionsQuery = gql`
  query myConnections($offset: Int!, $limit: Int!) {
    myConnections(offset: $offset, limit: $limit) {
      totalResults
      data {
        id
        fullName
        avatar
        avatarBlurhash
        avatarDefaultColor
        avatarLabel
        pronouns
        identity
      }
    }
  }
`

export interface MyConnectionsResponse {
  myConnections: {
    totalResults: number
    data: Connection[]
  }
}

export const connectionsByUserIdQuery = gql`
  query connectionsByUserId($userId: UUID!, $offset: Int!, $limit: Int!) {
    connectionsByUserId(userId: $userId, offset: $offset, limit: $limit) {
      totalResults
      data {
        id
        fullName
        avatar
        avatarBlurhash
        avatarDefaultColor
        avatarLabel
        pronouns
      }
    }
  }
`

export interface connectionsByUserIdResponse {
  connectionsByUserId: {
    totalResults: number
    data: Connection[]
  }
}

export const anonCountQuery = gql`
  mutation AnonCount($counterName: String!) {
    anonCount(counterName: $counterName)
  }
`
