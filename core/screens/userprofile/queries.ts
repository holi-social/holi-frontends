import { gql } from '@apollo/client/core'
import { z } from 'zod'

import type { User } from '@holi/core/screens/userprofile/types'

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

export const UpdateAuthenticatedUserInputSchema = z.object({
  avatar: z.string().optional(),
  firstName: z.string().min(2, { message: 'Should be at least 2 characters' }).optional(),
  lastName: z.string().optional(),
  aboutMe: z.string().optional(),
  pronouns: z.string().optional(),
  location: z.string().optional(),
  engagementLevel: z.string().optional(),
  interests: z.array(z.string()).optional(),
  sdgs: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
})

export type UpdateAuthenticatedUserInput = z.infer<typeof UpdateAuthenticatedUserInputSchema>

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
