import { gql } from '@apollo/client/core'

import { Post } from '@holi/core/screens/posts/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const PostCommentFragment = gql`
  ${userAvatarFragment}
  fragment PostCommentFull on PostComment {
    id
    text
    created
    creator {
      ...UserAvatar
    }
    mentions {
      id
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
  ${userAvatarFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment PostFragment on Post {
    id
    title
    text
    created
    creator {
      ...UserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...UserAvatar
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
  }
`

export const PostDetailsFragment = gql`
  ${userAvatarFragment}
  ${PostCommentFragment}
  ${PostImageFragment}
  ${LinkFragment}

  fragment PostFull on Post {
    id
    title
    text
    created
    creator {
      ...UserAvatar
    }
    numberOfComments
    commenters {
      totalResults
      data {
        ...UserAvatar
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
  }
`

export const PostById = gql`
  ${PostDetailsFragment}

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
