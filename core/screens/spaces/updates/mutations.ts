import { gql } from '@apollo/client'
import { z } from 'zod'

import { PostFragment } from '@holi/core/screens/posts/queries'
import { Post } from '@holi/core/screens/posts/types'
import { VisibilityFilter } from '@holi/core/screens/spaces/types'

export const CreateSpacePostSchema = z.object({
  spaceId: z.string() /* UUID */,
  title: z.string().optional() /* Title */,
  text: z.string() /* Content */,
  image: z.instanceof(Object).optional(),
  visibility: z.string() /* VisibilityType */,
  language: z.string().optional(),
})

export type CreatePostInput = z.infer<typeof CreateSpacePostSchema>

export const createSpacePostMutation = gql`
  ${PostFragment}


  mutation createSpacePost($input: CreatePostInput!) {
    createSpacePost2(input: $input) {
      ...PostFragment
      space {
        posts(offset: 0, limit: 10, visibility: ${VisibilityFilter.ALL}) {
          data {
            ...PostFragment
          }
        }
      }
    }
  }
`

export type CreateSpacePostMutationResponse = {
  createSpacePost: Post
}

export const UpdatePostInputSchema = z.object({
  spaceId: z.string() /* UUID */,
  title: z.string().optional() /* Title */,
  text: z.string() /* Content */,
  image: z.instanceof(Object).optional(),
  visibility: z.string() /* VisibilityType */,
  language: z.string().optional(),
})

export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>

export const updateSpacePostMutation = gql`
  ${PostFragment}

  mutation updateSpacePost($input: UpdatePostInput!) {
    updateSpacePost(input: $input) {
      ...PostFragment
    }
  }
`

export type UpdateSpacePostMutationResponse = {
  updateSpacePost: Post
}

export const deleteSpacePostMutation = gql`
  mutation deleteSpacePost($id: UUID!) {
    deleteSpacePost(id: $id) {
      id
    }
  }
`
