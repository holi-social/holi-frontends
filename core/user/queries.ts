import { gql } from '@apollo/client/core'

import { User } from '@holi/core/user/types'

// TODO: user needs also default color (HOLI-1525)
export const userFragment = gql`
  fragment FullUser on User {
    id
    avatar
    firstName
    lastName
    aboutMe
    pronouns
    location
    avatarDefaultColor
    avatarLabel
    engagementLevel
    interests
    sdgs
    skills
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

export type UpdateAuthenticatedUserInput = {
  avatar?: string
  firstName?: string
  lastName?: string
  aboutMe?: string
  pronouns?: string
  location?: string
  engagementLevel?: string
  interests?: [string]
  sdgs?: [string]
  skills?: [string]
}

export type UpdateAuthenticatedUserResponse = {
  authenticatedUser: User
}

export const updateUserMutation = gql`
  ${userFragment}

  mutation UpdateAuthenticatedUser($input: UpdateAuthenticatedUserInput!) {
    updateAuthenticatedUser(input: $input) {
      authenticatedUser {
        ...FullUser
      }
    }
  }
`
