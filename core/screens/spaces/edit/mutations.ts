import { gql } from '@apollo/client/core'
import { z } from 'zod'

import type { Space, SpaceLink } from '@holi/core/screens/spaces/types'
import { SPACE_DESCRIPTION_LEN, SPACE_TITLE_LEN } from '@holi/core/screens/spaces/create/mutations'

export const UpdateSpaceInputSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(2).max(SPACE_TITLE_LEN).optional(),
  description: z.string().trim().min(1).max(SPACE_DESCRIPTION_LEN).optional(),
  location: z.string().optional(),
  avatar: z.instanceof(Object).optional(),
  topicsV2: z.array(z.string()).optional(),
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
      topicsV2
      sdgs {
        id
        title
        number
      }
      links {
        id
        type
        url
        name
      }
      onboarding {
        steps {
          text
        }
      }
    }
  }
`

export type UpdateSpaceResponse = {
  updateSpace: Partial<Space>
}

export const UpdateExternalLinkSchema = z.object({
  id: z.string() /* UUID */,
  type: z.string() /* SpaceLinkType */,
  url: z.string().url().max(500),
  name: z.string().trim().max(100),
})

export type UpdateExternalLinkInput = z.infer<typeof UpdateExternalLinkSchema>

export type UpdateExternalLinkResponse = {
  updateExternalLink: SpaceLink
}

export const updateExternalLinkMutation = gql`
  mutation UpdateExternalLink($input: UpdateExternalLinkInput!) {
    updateExternalLink(input: $input) {
      id
      type
      url
      name
    }
  }
`

export const deleteSpaceLinkMutation = gql`
  mutation DeleteSpaceLink($id: UUID!) {
    deleteExternalLink(id: $id) {
      success
    }
  }
`

export interface DeleteSpaceLinkResponse {
  success: boolean
}
