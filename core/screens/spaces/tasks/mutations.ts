import { gql } from '@apollo/client/core'
import { z } from 'zod'

import type { Task } from '@holi/core/screens/spaces/types'

export const CreateTaskSchema = z.object({
  spaceId: z.string() /* UUID */,
  visibility: z.string() /* VisibilityType */,
  name: z.string().min(2).max(128).optional(),
  description: z.string().trim().max(1200).optional(),
  locationType: z.string() /* LocationType */,
  regularity: z.string() /* Regularity */,
  contactEmail: z.string().email(),
  location: z.string().optional(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  contactPhone: z.string().optional(),
  thumbnail: z.instanceof(Object).optional(),
  slotsAvailable: z.number(),
  slotsTaken: z.number().optional(),
  skillsV2: z.array(z.string()).optional(),
})

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>

export const createTaskMutation = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      name
      description
      visibility
      regularity
      locationType
      location
      contactEmail
      contactPhone
    }
  }
`

export type CreateTaskResponse = {
  createTask: Task
}

export const UpdateTaskSchema = z.object({
  taskId: z.string() /* UUID */,
  spaceId: z.string() /* UUID */,
  visibility: z.string() /* VisibilityType */,
  name: z.string().min(2).max(128).optional(),
  description: z.string().trim().max(1200).optional(),
  locationType: z.string() /* LocationType */,
  regularity: z.string() /* Regularity */,
  contactEmail: z.string().email().optional(),
  location: z.string().optional(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  contactPhone: z.string().optional(),
  thumbnail: z.instanceof(Object).optional(),
  slotsAvailable: z.number(),
  slotsTaken: z.number().optional(),
  skillsV2: z.array(z.string()).optional(),
})

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>

export const updateTaskMutation = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      name
      description
      visibility
      regularity
      locationType
      location
      contactEmail
      contactPhone
      thumbnail
    }
  }
`

export type UpdateTaskResponse = {
  updateTask: Task
}

export interface DeleteTaskResponse {
  success: boolean
}

export const deleteTaskMutation = gql`
  mutation DeleteTask($id: UUID!) {
    deleteTask(id: $id) {
      success
    }
  }
`
