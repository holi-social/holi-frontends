import { gql } from '@apollo/client'
import { z } from 'zod'

import type { Appointment } from '@holi/core/screens/appointments/types'

export const CreateAppointmentSchema = z.object({
  spaceId: z.string() /* UUID */,
  title: z.string().min(2).max(128),
  inviteOnly: z.boolean(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  locationDetails: z
    .object({
      completeAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional().nullable(),
      country: z.string().optional(),
      geolocation: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
        })
        .optional(),
    })
    .or(z.null())
    .optional(),
  description: z.string().trim().max(5000).optional(),
  permission: z.string() /* PermissionType */,
  videoCallLink: z.string().or(z.null()).optional(),
  videoCallInfo: z.string().or(z.null()).optional(),
  thumbnail: z.instanceof(Object).optional(),
})

export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>

export const createAppointmentMutation = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      id
      slug
      title
      description
      inviteOnly
      startDateTime
      endDateTime
      locationDetails {
        completeAddress
        city
        state
        country
        geolocation {
          longitude
          latitude
        }
      }
      description
      permission
      videoCallLink {
        id
        url
        additionalInfo
      }
      thumbnail
      thumbnailBlurhash
    }
  }
`

export type CreateAppointmentResponse = {
  createAppointment: Appointment
}

export const UpdateAppointmentSchema = z.object({
  spaceId: z.string() /* UUID */,
  title: z.string().min(2).max(128).optional(),
  inviteOnly: z.boolean(),
  startDateTime: z.string().optional(),
  endDateTime: z.string().optional(),
  locationDetails: z
    .object({
      completeAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      geolocation: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
        })
        .optional(),
    })
    .optional(),
  description: z.string().trim().max(5000).optional(),
  permission: z.string() /* PermissionType */,
  videoCallLink: z.string().optional(),
  videoCallInfo: z.string().optional(),
  thumbnail: z.instanceof(Object).optional(),
})

export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>

export const updateAppointmentMutation = gql`
  mutation UpdateAppointment($input: UpdateAppointmentInput!) {
    updateAppointment(input: $input) {
      id
      slug
      title
      description
      inviteOnly
      startDateTime
      endDateTime
      locationDetails {
        completeAddress
        city
        state
        country
        geolocation {
          longitude
          latitude
        }
      }
      description
      permission
      videoCallLink {
        id
        url
        additionalInfo
      }
      thumbnail
      thumbnailBlurhash
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
  mutation DeleteAppointment($appointmentId: UUID!) {
    deleteAppointment(appointmentId: $appointmentId) {
      success
    }
  }
`

export const generateAppointmentIcsFileMutation = gql`
  mutation GenerateAppointmentIcsFile($appointmentId: UUID!) {
    generateAppointmentIcsFile(appointmentId: $appointmentId)
  }
`

export type GenerateAppointmentIcsFileResponse = {
  generateAppointmentIcsFile: string
}
