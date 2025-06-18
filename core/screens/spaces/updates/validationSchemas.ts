import { z } from 'zod'

export const CreateSpacePostSchema = z.object({
  spaceId: z.string().ulid(),
  title: z.string().optional(),
  text: z.string(),
  image: z.instanceof(Object).optional(),
  visibility: z.string() /* VisibilityType */,
  language: z.string().optional(),
})

export type CreatePostInput = z.infer<typeof CreateSpacePostSchema>

export const UpdatePostInputSchema = z.object({
  spaceId: z.string().ulid(),
  title: z.string().optional(),
  text: z.string(),
  image: z.instanceof(Object).optional(),
  visibility: z.string() /* VisibilityType */,
  language: z.string().optional(),
})

export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>
