import { z } from 'zod'

export const SPACE_TITLE_LEN = 80
export const SPACE_DESCRIPTION_LEN = 600

export const ValidateSpaceInputSchema = z.object({
  title: z.string().trim().min(2).max(SPACE_TITLE_LEN),
  description: z.string().trim().min(1).max(SPACE_DESCRIPTION_LEN),
  topicsV2: z.array(z.string()).min(1).max(6).optional(),
  cover: z.instanceof(Object).optional(),
})

export type ValidateSpaceInput = z.infer<typeof ValidateSpaceInputSchema>

export const CreateSpaceInputSchema = z.object({
  title: z.string().trim().min(2).max(SPACE_TITLE_LEN),
  description: z.string().trim().min(1).max(SPACE_DESCRIPTION_LEN),
  topicsV2: z.array(z.string()).min(1).max(6),
  cover: z.instanceof(Object),
})

export type CreateSpaceInput = z.infer<typeof CreateSpaceInputSchema>

export const AddExternalLinkSchema = z.object({
  spaceId: z.string().ulid(),
  type: z.string(),
  url: z.string().url().max(500),
  name: z.string().trim().max(100),
})

export type AddExternalLinkInput = z.infer<typeof AddExternalLinkSchema>
