import { z } from 'zod'

export const CreateOrEditTaskSchema = z.object({
  visibility: z.string(),
  name: z.string().min(2).max(128),
  description: z.string().min(2).trim().max(1200),
  impact: z.string().trim().max(1200).optional().nullable(),
  locationType: z.string(),
  interactionType: z.string(),
  regularity: z.string(),
  duration: z.string(),
  timeframeStartDate: z.string().optional().nullable(),
  timeframeEndDate: z.string().optional().nullable(),
  contactEmail: z.string().email(),
  location: z.string().optional().nullable(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  contactPhone: z.string().optional(),
  thumbnail: z.union([z.instanceof(Object).optional(), z.string().optional()]),
  slotsAvailable: z.number(),
  slotsTaken: z.number().optional(),
  skills: z.array(z.string()).optional(),
  skillsV2: z.array(z.string()).optional(),
  interactionSignupLink: z.string().url().optional().nullable(),
})
export type CreateTaskInput = z.infer<typeof CreateOrEditTaskSchema>

export const createOrEditTaskSchemaRefinedInteractionSignupLink = CreateOrEditTaskSchema.refine(
  (data) => {
    if (data.interactionType === 'LINK') {
      return !!data.interactionSignupLink
    }
    return true
  },
  {
    message: "interactionSignupLink is required when interactionType is 'LINK'",
    path: ['interactionSignupLink'],
  }
)
