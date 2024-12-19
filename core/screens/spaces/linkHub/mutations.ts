import { gql } from '@apollo/client'
import { z } from 'zod'

import { SpaceCollaborationTool } from '@holi/core/screens/spaces/types'

const COLLABORATION_TOOL_TITLE_LEN = 50
const COLLABORATION_TOOL_DESCRIPTION_LEN = 100

export const AddCollaborationToolSchema = z.object({
  title: z.string().trim().min(3).max(COLLABORATION_TOOL_TITLE_LEN).optional(),
  description: z.string().trim().min(3).max(COLLABORATION_TOOL_DESCRIPTION_LEN).optional(),
  spaceId: z.string() /* UUID */,
  collectionType: z.string() /* UUID */,
  thumbnail: z.instanceof(Object).optional(),
})

export type AddCollaborationToolInput = z.infer<typeof AddCollaborationToolSchema>

export const addCollaborationToolMutation = gql`
  mutation AddCollaborationTool($input: AddCollaborationToolInput!) {
    addCollaborationTool(input: $input) {
      id
      url
      title
      domain
      description
      collectionType
    }
  }
`

export type AddCollaborationToolResponse = {
  addCollaborationTool: SpaceCollaborationTool
}

export const UpdateCollaborationToolSchema = z.object({
  id: z.string() /* UUID */,
  title: z.string().trim().min(3).max(COLLABORATION_TOOL_TITLE_LEN).optional(),
  description: z.string().trim().min(3).max(COLLABORATION_TOOL_DESCRIPTION_LEN).optional(),
  collectionType: z.string(),
  thumbnail: z.instanceof(Object).optional(),
})

export type UpdateCollaborationToolInput = z.infer<typeof UpdateCollaborationToolSchema>

export type UpdateCollaborationToolResponse = {
  updateCollaborationTool: SpaceCollaborationTool
}

export const updateCollaborationToolMutation = gql`
  mutation UpdateCollaborationTool($input: UpdateCollaborationToolInput!) {
    updateCollaborationTool(input: $input) {
      id
      url
      title
      description
      collectionType
    }
  }
`

export interface DeleteCollaborationToolResponse {
  success: boolean
}

export const deleteCollaborationToolMutation = gql`
  mutation DeleteCollaborationTool($id: UUID!) {
    deleteCollaborationTool(id: $id) {
      success
    }
  }
`
