import { z } from 'zod'

export const CreateTaskSchema = z.object({
  spaceId: z.string() /* UUID */,
  visibility: z.string() /* VisibilityType */,
  name: z.string().min(2).max(128).optional(),
  description: z.string().trim().max(1200).optional(),
  locationType: z.string() /* LocationType */,
  interactionType: z.string() /* InteractionType */,
  regularity: z.string() /* Regularity */,
  duration: z.string(),
  timeframeStartDate: z.date().optional(),
  timeframeEndDate: z.date().optional(),
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
  interactionSignupLink: z.string().url().optional(),
})

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>

export const UpdateTaskSchema = z.object({
  taskId: z.string() /* UUID */,
  spaceId: z.string() /* UUID */,
  visibility: z.string() /* VisibilityType */,
  name: z.string().min(2).max(128).optional(),
  description: z.string().trim().max(1200).optional(),
  locationType: z.string() /* LocationType */,
  interactionType: z.string() /* InteractionType */,
  regularity: z.string() /* Regularity */,
  duration: z.string(),
  timeframeStartDate: z.date().optional(),
  timeframeEndDate: z.date().optional(),
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
  interactionSignupLink: z.string().url().optional(),
})

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
