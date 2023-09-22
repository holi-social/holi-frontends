import { ApolloError, FetchResult, useQuery } from '@apollo/client'
import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Dispatch } from 'react'
import { SetStateAction } from 'react'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { PostById, PostByIdResponse } from '@holi/core/screens/posts/queries'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { Space, VisibilityFilter, VisibilityType } from '@holi/core/screens/spaces/types'
import {
  CreateSpacePostMutationResponse,
  UpdateSpacePostMutationResponse,
  createSpacePostMutation,
  updateSpacePostMutation,
} from '@holi/core/screens/spaces/updates/mutations'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

export interface UseCreateOrUpdateSpacePost {
  // Status
  loading: boolean
  error?: ApolloError
  isUpdate: boolean
  // meta
  space?: Space
  // Form State
  title: string
  content: string
  image?: HoliImageInfo
  visibility?: VisibilityType
  setTitle: Dispatch<SetStateAction<string>>
  setContent: Dispatch<SetStateAction<string>>
  setImage: Dispatch<SetStateAction<HoliImageInfo | undefined>>
  setVisibility: Dispatch<SetStateAction<VisibilityType>>
  // interface
  saveSpacePost: () => Promise<FetchResult>
}

export const useCreateOrUpdateSpacePost = (spaceIdOrName?: string, postId?: string): UseCreateOrUpdateSpacePost => {
  const { displayError } = useErrorHandling()
  const { navigateBack } = useRouting()

  //input fields
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [image, setImage] = useState<HoliImageInfo>()
  const [visibility, setVisibility] = useState<VisibilityType>(VisibilityType.MEMBERS)

  // data fetch
  const {
    data: spaceQueryData,
    error: spaceQueryError,
    loading: spaceQueryLoading,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
    onError: (error) => {
      navigateBack()
      displayError(error, 'Failed to load space', {
        location: 'useCreateOrUpdateSpacePost.spaceByIdQuery',
        spaceIdOrName,
      })
    },
  })
  const space = spaceQueryData?.spaceById

  const {
    data: postQueryData,
    error: postQueryError,
    loading: postQueryLoading,
  } = useQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
    skip: !postId,
    onError: (error) => {
      navigateBack()
      displayError(error, 'Failed to load space post', {
        location: 'useCreateOrUpdateSpacePost.PostById',
        spaceIdOrName,
        postId,
      })
    },
  })
  const postToUpdate = postQueryData?.postById

  useEffect(() => {
    if (postToUpdate) {
      postToUpdate.title && setTitle(postToUpdate.title)
      postToUpdate.text && setContent(postToUpdate.text)
      postToUpdate.image ?? setImage(postToUpdate.image)
      setVisibility(postToUpdate.isPublic ? VisibilityType.PUBLIC : VisibilityType.MEMBERS)
    }
  }, [postToUpdate])

  // create & update
  const [createSpacePost, { loading: loadingCreateMutation }] = useMutation<CreateSpacePostMutationResponse>(
    createSpacePostMutation,
    {
      onCompleted: () => navigateBack(),
      onError: (error) =>
        displayError(error, 'Failed to create space post', {
          location: 'useCreateOrUpdateSpacePost.createSpacePost',
          spaceIdOrName,
        }),
      // refetch first page of both the current visibility filter and the ALL filter
      refetchQueries: [
        {
          query: spacePostsQuery,
          variables: { idOrName: spaceIdOrName, offset: 0, limit: 10, visibility: visibility },
        },
        {
          query: spacePostsQuery,
          variables: { idOrName: spaceIdOrName, offset: 0, limit: 10, visibility: VisibilityFilter.ALL },
        },
      ],
    }
  )

  const [updateSpacePost, { loading: loadingUpdateMutation }] = useMutation<UpdateSpacePostMutationResponse>(
    updateSpacePostMutation,
    {
      onCompleted: () => navigateBack(),
      onError: (error) =>
        displayError(error, 'Failed to update space post', {
          location: 'useCreateOrUpdateSpacePost.updateSpacePost',
          spaceIdOrName,
          postId,
        }),
      refetchQueries: [spacePostsQuery],
    }
  )

  const saveSpacePost = () => {
    const input = {
      title: title.trim() && title.length > 0 ? title : undefined,
      text: content.trim(),
      image: image?.blob,
      visibility: visibility || VisibilityType.MEMBERS,
    }

    if (postId) {
      return updateSpacePost({ variables: { input: { postId, ...input } } })
    } else {
      return createSpacePost({ variables: { input: { spaceId: space?.id, ...input } } })
    }
  }

  return {
    loading: spaceQueryLoading || postQueryLoading || loadingCreateMutation || loadingUpdateMutation,
    error: spaceQueryError || postQueryError,
    isUpdate: !!postId,
    space,
    title,
    content,
    image,
    visibility,
    setTitle,
    setContent,
    setImage,
    setVisibility,
    saveSpacePost,
  }
}

export default useCreateOrUpdateSpacePost
