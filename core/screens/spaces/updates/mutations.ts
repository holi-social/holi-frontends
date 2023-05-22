import { gql } from '@apollo/client'
import { z } from 'zod'

import { Post } from '@holi/core/screens/posts/types'

export const CreateSpacePostSchema = z.object({
  spaceId: z.string() /* UUID */,
  title: z.string().optional() /* Title */,
  text: z.string() /* Content */,
  image: z.instanceof(Object).optional(),
  visibility: z.string() /* VisibilityType */,
})

export type CreatePostInput = z.infer<typeof CreateSpacePostSchema>

export const createSpacePostMutation = gql`
  mutation createSpacePost($input: CreatePostInput!) {
    createSpacePost(input: $input) {
      id
    }
  }
`

export type CreateSpacePostResponse = {
  createSpacePost: Post
}
