import { gql } from '@apollo/client/core'
import { z } from 'zod'

import { FeedPostDetailsFragment } from '@holi/core/screens/individualPosts/fragments'
import type { FeedPost } from '@holi/core/screens/individualPosts/types'

export const FEED_POST_TITLE_MAX_CHARACTERS = 128
export const FEED_POST_DESCRIPTION_MAX_CHARACTERS = 5000

export const FeedPostSchema = z.object({
  title: z.string().min(2).max(FEED_POST_TITLE_MAX_CHARACTERS),
  description: z.string().trim().min(2).max(FEED_POST_DESCRIPTION_MAX_CHARACTERS),
  categoryId: z.string().optional().nullable(),
  topicsV2: z.array(z.string()).max(6).optional(),
  visibility: z.string() /* VisibilityLevel */,
  image: z.instanceof(Object).optional().nullable(),
  images: z.array(z.instanceof(Object)).max(10).optional().nullable(),
  imageUrls: z.array(z.string()).max(10).optional().nullable(),
  existingImages: z.array(z.string()).max(10).optional().nullable(),
  newImages: z.array(z.instanceof(Object)).max(10).optional().nullable(),
  postId: z.string().optional(), // for edit post
  language: z.string().optional(),
  location: z.string().optional(),
  aspectRatio: z.string().optional(),
  geolocation: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
})

export type CreateFeedPostInput = z.infer<typeof FeedPostSchema>

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

export type UpdateFeedPostInput = z.infer<typeof FeedPostSchema>

export const updateFeedPostMutation = gql`
  ${FeedPostDetailsFragment}

  mutation UpdateFeedPost($input: UpdateFeedPostInput!) {
    updateFeedPost(input: $input) {
      ...FeedPostFull
    }
  }
`

export type UpdateFeedPostResponse = {
  createFeedPost: FeedPost
}

export const deleteFeedPostMutation = gql`
  mutation DeleteFeedPost($postId: UUID!) {
    deleteFeedPost(postId: $postId) {
      success
    }
  }
`

export interface DeleteFeedPostResponse {
  success: boolean
}

export const UpdateFeedPostReactionMutation = gql`
  ${FeedPostDetailsFragment}

  mutation UpdateFeedPostReaction($postId: UUID!, $reactionType: ReactionType!, $reactionAction: ReactionAction!) {
    updateFeedPostReaction(postId: $postId, reactionType: $reactionType, reactionAction: $reactionAction) {
      ...FeedPostFull
    }
  }
`

export interface UpdateFeedPostReactionResponse {
  feedPost: FeedPost
}
