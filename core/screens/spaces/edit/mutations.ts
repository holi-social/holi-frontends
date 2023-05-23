import { gql } from '@apollo/client/core'
import { z } from 'zod'

import type { Space } from '@holi/core/screens/spaces/types'

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
