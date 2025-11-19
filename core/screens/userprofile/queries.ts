import { gql } from '@apollo/client'
import { z } from 'zod'

import { FullUserFragmentDoc } from '@holi/api/graphql/graphql-codegen'
import { FullAuthenticatedUserFragment } from '@holi/core/domain/shared/queries'
import type { AuthenticatedUser, User } from '@holi/core/domain/shared/types'
import type { UpdateConnectionWithUserActions } from '@holi/core/screens/userprofile/types'

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
  interestsV2: z.array(z.string()).optional(),
  skillsV2: z.array(z.string()).optional(),
  trackingConsentAnalytics: z.boolean().optional().nullable(),
  trackingConsentPersonalization: z.boolean().optional().nullable(),
  trackingConsentAdPartners: z.boolean().optional().nullable(),
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

  mutation UpdateAuthenticatedUserV2($input: UpdateAuthenticatedUserInput!) {
    updateAuthenticatedUserV2(input: $input) {
      ...FullAuthenticatedUser
    }
  }
`

export const updateConnectionWithUserMutation = gql`
  ${FullUserFragmentDoc}

  mutation UpdateConnectionWithUser($input: UpdateConnectionWithUserInput!) {
    updateConnectionWithUser(input: $input) {
      ...FullUser
    }
  }
`

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
