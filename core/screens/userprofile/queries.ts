import { gql } from '@apollo/client/core'
import { z } from 'zod'

import type { Term, UpdateConnectionWithUserActions, User } from '@holi/core/screens/userprofile/types'

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

export const userByIdQuery = gql`
  ${userFragment}

  query UserById($userId: String!) {
    userById(id: $userId) {
      ...FullUser
      connectionStatusToMyself
    }
  }
`

export type UserByIdResponse = {
  userById: User
}

export const UpdateAuthenticatedUserInputSchema = z.object({
  avatar: z.instanceof(Object).optional(),
  firstName: z.string().min(2, { message: 'Should be at least 2 characters' }).optional(),
  lastName: z.string().optional(),
  aboutMe: z.string().optional(),
  pronouns: z.string().optional(),
  location: z.string().optional(),
  engagementLevel: z.string().optional(),
  interests: z.array(z.string() /* UUID */).optional(),
  sdgs: z.array(z.string() /* UUID */).optional(),
  skills: z.array(z.string() /* UUID */).optional(),
})

export type UpdateAuthenticatedUserInput = z.infer<typeof UpdateAuthenticatedUserInputSchema>

export type UpdateAuthenticatedUserResponse = {
  updateAuthenticatedUser: {
    authenticatedUser: User
  }
}

export type UpdateConnectionWithUserInput = {
  userId: string
  action: UpdateConnectionWithUserActions
}

export type UpdateConnectionWithUserResponse = {
  updateConnectionWithUser: {
    userById: User
  }
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

export const updateConnectionWithUserMutation = gql`
  mutation UpdateConnectionWithUser($input: UpdateConnectionWithUserInput!) {
    updateConnectionWithUser(input: $input) {
      userById {
        id
        connectionStatusToMyself
      }
    }
  }
`

export const sdgsQuery = gql`
  query SDGs {
    sdgs {
      id
      title
    }
  }
`

export interface SdgsQueryResult {
  sdgs: Term[]
}

export const skillsQuery = gql`
  query Skills {
    skills {
      id
      title
    }
  }
`

export interface SkillsQueryResult {
  skills: Term[]
}

export const topicsQuery = gql`
  query Topics {
    topics {
      id
      title
    }
  }
`

export interface TopicsQueryResult {
  topics: Term[]
}
