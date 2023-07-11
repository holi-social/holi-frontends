import { gql } from '@apollo/client/core'

import { Comment, Post } from '@holi/core/screens/posts/types'
import { FullUserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const PostCommentFragment = gql`
  ${FullUserAvatarFragment}
  fragment PostCommentFull on PostComment {
    id
    text
    created
    creator {
      ...FullUserAvatar
    }
    mentions {
      id
      fullName
    }
    myReaction {
      HEART
    }
    reactions {
      HEART
    }
  }
`

export const PostImageFragment = gql`
  fragment PostImageData on PostImage {
    id
    url
    height
    width
  }
`

export const LinkFragment = gql`
  fragment LinkFragment on LinkPreview {
    requestedUrl
    url
    title
    description
    type
    image
    siteName
    origin
  }
`

export const PostFragment = gql`
  ${FullUserAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment PostFragment on Post {
    id
    title
    text
    created
    creator {
      ...FullUserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...FullUserAvatar
      }
    }
    image {
      ...PostImageData
    }
    links {
      ...LinkFragment
    }
    mentions {
      id
      fullName
    }
    myReaction {
      HEART
    }
    reactions {
      HEART
    }
  }
`

export const PostDetailsFragment = gql`
  ${FullUserAvatarFragment}
  ${PostCommentFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment PostFull on Post {
    id
    title
    text
    created
    creator {
      ...FullUserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...FullUserAvatar
      }
    }
    comments {
      ...PostCommentFull
    }
    image {
      ...PostImageData
    }
    links {
      ...LinkFragment
    }
    mentions {
      id
      fullName
    }
    myReaction {
      HEART
    }
    reactions {
      HEART
    }
    isPublic
  }
`

export const PostById = gql`
  ${PostDetailsFragment}

  query PostById($id: UUID!) {
    postById(id: $id) {
      ...PostFull
    }
  }
`

export type PostByIdResponse = {
  postById: Post
}

export type CreatePostCommentInput = {
  postId: string
  text: string
}

export const CreatePostCommentMutation = gql`
  ${PostDetailsFragment}
  ${PostCommentFragment}

  mutation CreatePostComment($input: CreatePostCommentInput!) {
    updatePostComment(input: $input) {
      postComment {
        ...PostCommentFull
      }
      postById {
        ...PostFull
      }
    }
  }
`

export type CreatePostCommentResponse = {
  postComment: Comment
  postById: Post
}

export const UpdatePostReactionMutation = gql`
  ${PostFragment}

  mutation UpdatePostReaction($id: UUID!, $reactionType: ReactionType!, $reactionAction: ReactionAction!) {
    updatePostReaction(id: $id, reactionType: $reactionType, reactionAction: $reactionAction) {
      ...PostFragment
    }
  }
`

export interface UpdatePostReactionResponse {
  post: Post
}

export const UpdatePostCommentReactionMutation = gql`
  ${PostCommentFragment}

  mutation UpdatePostCommentReaction($id: UUID!, $reactionType: ReactionType!, $reactionAction: ReactionAction!) {
    updatePostCommentReaction(id: $id, reactionType: $reactionType, reactionAction: $reactionAction) {
      ...PostCommentFull
    }
  }
`

export interface UpdatePostCommentReactionResponse {
  postComment: Comment
}

export interface DeletePostCommentResponse {
  success: boolean
}

export const DeletePostCommentMutation = gql`
  mutation DeletePostComment($id: UUID!) {
    deletePostComment(id: $id) {
      success
    }
  }
`
