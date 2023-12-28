import { gql } from '@apollo/client/core'
import { z } from 'zod'

import type { Appointment } from '@holi/core/screens/appointments/types'

export const CreateAppointmentSchema = z.object({
  spaceId: z.string() /* UUID */,
  title: z.string().min(2).max(40).optional(),
  inviteOnly: z.boolean(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  location: z.string().optional(),
  description: z.string().trim().max(600).optional(),
  permission: z.string() /* PermissionType */,
  videoCallLink: z.string().optional(),
  videoCallInfo: z.string().optional(),
  thumbnail: z.instanceof(Object).optional(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
})

export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>

export const createAppointmentMutation = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      id
      title
      description
      inviteOnly
      startDateTime
      endDateTime
      location
      description
      permission
      videoCallLink {
        id
        url
        additionalInfo
      }
      thumbnail
      thumbnailBlurhash
      geolocation {
        longitude
        latitude
      }
    }
  }
`

export type CreateAppointmentResponse = {
  createAppointment: Appointment
}

export const UpdateAppointmentSchema = z.object({
  spaceId: z.string() /* UUID */,
  title: z.string().min(2).max(40).optional(),
  inviteOnly: z.boolean(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  location: z.string().optional(),
  description: z.string().trim().max(600).optional(),
  permission: z.string() /* PermissionType */,
  videoCallLink: z.string().optional(),
  videoCallInfo: z.string().optional(),
  thumbnail: z.instanceof(Object).optional(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
})

export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>

export const updateAppointmentMutation = gql`
  mutation UpdateAppointment($input: UpdateAppointmentInput!) {
    updateAppointment(input: $input) {
      id
      title
      description
      inviteOnly
      startDateTime
      endDateTime
      location
      description
      permission
      videoCallLink {
        id
        url
        additionalInfo
      }
      thumbnail
      thumbnailBlurhash
      geolocation {
        longitude
        latitude
      }
    }
  }
`

export type UpdateAppointmentResponse = {
  updateAppointment: Appointment
}

export interface DeleteAppointmentResponse {
  success: boolean
}

export const deleteAppointmentMutation = gql`
  mutation DeleteAppointment($id: UUID!) {
    deleteAppointment(id: $id) {
      success
    }
  }
`
