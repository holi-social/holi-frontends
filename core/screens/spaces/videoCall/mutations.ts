import { gql } from '@apollo/client'
import { z } from 'zod'

import { VideoCallLink } from '@holi/core/screens/spaces/types'

export const AddVideoCallLinkSchema = z.object({
  roomName: z.string().trim().min(1).max(50).optional(),
})

export type AddVideoCallLinkInput = z.infer<typeof AddVideoCallLinkSchema>

export const addVideoCallLinkMutation = gql`
  mutation AddVideoCallLink($input: AddVideoCallLinkInput!) {
    addVideoCallLink(input: $input) {
      id
      url
      roomName
    }
  }
`

export type AddVideoCallLinkResponse = {
  addVideoCallLink: VideoCallLink
}

export const UpdateVideoCallLinkSchema = z.object({
  id: z.string() /* UUID */,
  url: z.string().url().max(500).optional(),
  roomName: z.string().trim().min(1).max(50).optional(),
})

export type UpdateVideoCallLinkInput = z.infer<typeof UpdateVideoCallLinkSchema>

export const updateVideoCallLinkMutation = gql`
  mutation UpdateVideoCallLink($input: UpdateVideoCallLinkInput!) {
    updateVideoCallLink(input: $input) {
      id
      url
      roomName
    }
  }
`

export type UpdateVideoCallLinkResponse = {
  updateVideoCallLink: VideoCallLink
}

export const deleteVideoCallLinkMutation = gql`
  mutation DeleteVideoCallLink($id: UUID!) {
    deleteVideoCallLink(id: $id) {
      success
    }
  }
`

export interface DeleteVideoCallLinkResponse {
  success: boolean
}
