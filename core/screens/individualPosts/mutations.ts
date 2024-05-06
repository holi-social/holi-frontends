import { gql } from '@apollo/client/core'
import { z } from 'zod'

import { FeedPostDetailsFragment } from '@holi/core/screens/individualPosts/fragments'
import { FeedPost } from '@holi/core/screens/individualPosts/types'

export const CreateFeedPostSchema = z.object({
  title: z.string().min(2).max(128),
  description: z.string().trim().min(2).max(5000),
  categoryId: z.string(),
  topicIds: z.array(z.string()).max(6).optional(),
  visibility: z.string() /* VisibilityLevel */,
  image: z.instanceof(Object).optional(),
})

export type CreateFeedPostInput = z.infer<typeof CreateFeedPostSchema>

export const createFeedPostMutation = gql`
  ${FeedPostDetailsFragment}

  mutation CreateFeedPost($input: CreateFeedPostInput!) {
    createFeedPost(input: $input) {
      ...FeedPostFull
    }
  }
`

export type CreateFeedPostResponse = {
  createFeedPost: FeedPost
}
