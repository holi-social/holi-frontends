import { gql } from '@apollo/client/core'
import { z } from 'zod'

import { FullSpaceFragment } from '@holi/core/screens/spaces/queries'
import type { Space, SpaceLink } from '@holi/core/screens/spaces/types'

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
  ${FullSpaceFragment}

  mutation CreateSpace($input: CreateSpaceInput!) {
    createSpace(input: $input) {
      ...FullSpace
    }
  }
`

export type CreateSpaceResponse = {
  createSpace: Space
}

export const AddExternalLinkSchema = z.object({
  spaceId: z.string() /* UUID */,
  type: z.string() /* SpaceLinkType */,
  url: z.string().url().max(500),
  name: z.string().trim().max(100),
})

export type AddExternalLinkInput = z.infer<typeof AddExternalLinkSchema>

export const addExternalLinkMutation = gql`
  mutation AddExternalLink($input: AddExternalLinkInput!) {
    addExternalLink(input: $input) {
      id
      type
      url
      name
    }
  }
`

export type AddExternalLinkResponse = {
  addExternalLink: SpaceLink
}
