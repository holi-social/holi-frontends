import { gql } from '@apollo/client'
import { z } from 'zod'

import { Post } from '@holi/core/screens/posts/types'
import { VisibilityFilter } from '@holi/core/screens/spaces/types'
import { SpaceUpdatePostFragment } from '@holi/core/screens/spaces/updates/queries'

export const CreateSpacePostSchema = z.object({
  spaceId: z.string() /* UUID */,
  title: z.string().optional() /* Title */,
  text: z.string() /* Content */,
  image: z.instanceof(Object).optional(),
  visibility: z.string() /* VisibilityType */,
})

export type CreatePostInput = z.infer<typeof CreateSpacePostSchema>

export const createSpacePostMutation = gql`
  ${SpaceUpdatePostFragment}


  mutation createSpacePost($input: CreatePostInput!) {
    createSpacePost2(input: $input) {
      ...SpaceUpdatePostFragment
      space {
        posts(offset: 0, limit: 10, visibility: ${VisibilityFilter.ALL}) {
          data {
            ...SpaceUpdatePostFragment
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
})

export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>

export const updateSpacePostMutation = gql`
  ${SpaceUpdatePostFragment}

  mutation updateSpacePost($input: UpdatePostInput!) {
    updateSpacePost(input: $input) {
      ...SpaceUpdatePostFragment
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
