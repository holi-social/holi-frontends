import { gql } from '@apollo/client/core'

import { Post } from '@holi/core/screens/posts/types'

export const PostCommentFragment = gql`
  fragment PostCommentFull on PostComment {
    id
    text
    created
    creator {
      id
      avatar
      avatarLabel
      avatarDefaultColor
      firstName
      lastName
      fullName
      aboutMe
    }
    mentions {
      id
      firstName
      lastName
      fullName
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

export const PostFragment = gql`
  ${PostCommentFragment}
  ${PostImageFragment}

  fragment PostFull on Post {
    id
    title
    text
    created
    creator {
      id
      avatar
      avatarLabel
      avatarDefaultColor
      firstName
      lastName
      fullName
      aboutMe
    }
    comments {
      ...PostCommentFull
    }
    image {
      ...PostImageData
    }
  }
`

export const PostById = gql`
  ${PostFragment}

  query PostById($id: String!) {
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
  ${PostFragment}
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
