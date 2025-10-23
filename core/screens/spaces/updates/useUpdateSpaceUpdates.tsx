import { type ApolloLink } from '@apollo/client'
import { type ApolloError } from '@apollo/client/v4-migration'
import { useLazyQuery, useQuery } from '@apollo/client/react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { isMaliciousUrlError, isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { detectLanguageQuery, type DetectLanguageQueryResponse } from '@holi/core/queries'
import { PostById, type PostByIdResponse } from '@holi/core/screens/posts/queries'
import type { PostImage } from '@holi/core/screens/posts/types'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import {
  type Space,
  SpacePostsBySpaceIdDocument,
  useCreateSpacePostMutation,
  useUpdateSpacePostMutation,
  VisibilityFilter,
  VisibilityType,
} from '@holi/api/graphql/graphql-codegen'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

export interface UseCreateOrUpdateSpacePost {
  // Status
  loading: boolean
  error?: ApolloError
  isUpdate: boolean
  // meta
  space?: Pick<Space, 'id' | 'name' | 'connectionStatusToMyself'>
  // Form State
  title: string
  content: string
  image?: HoliImageInfo | null
  currentImage?: PostImage
  visibility?: VisibilityType
  setTitle: Dispatch<SetStateAction<string>>
  setContent: Dispatch<SetStateAction<string>>
  setImage: Dispatch<SetStateAction<HoliImageInfo | undefined | null>>
  setVisibility: Dispatch<SetStateAction<VisibilityType>>
  // interface
  saveSpacePost: () => Promise<ApolloLink.Result>
}

export const useCreateOrUpdateSpacePost = (spaceIdOrName?: string, postId?: string): UseCreateOrUpdateSpacePost => {
  const { displayError } = useErrorHandling()
  const { navigateBack, replaceRoute } = useRouting()
  const { openToast } = useToast()
  const { t } = useTranslation()

  //input fields
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [image, setImage] = useState<HoliImageInfo | undefined | null>() // null is to remove the image
  const [currentImage, setCurrentImage] = useState<PostImage>()
  const [visibility, setVisibility] = useState<VisibilityType>(VisibilityType.Members)

  // data fetch
  const { loading: spaceQueryLoading, error: spaceQueryError, space } = useSpace(spaceIdOrName)

  const {
    data: postQueryData,
    error: postQueryError,
    loading: postQueryLoading,
  } = useQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
    skip: !postId,
  })

  useEffect(() => {
    if (postQueryError) {
      if (isNotFoundError(postQueryError)) {
        replaceRoute('/404')
        return
      }
      navigateBack()
      displayError(postQueryError, 'Failed to load space post', {
        location: 'useCreateOrUpdateSpacePost.PostById',
        spaceIdOrName,
        postId,
      })
    }
  }, [postQueryError, displayError, replaceRoute, navigateBack, spaceIdOrName, postId])
  const postToUpdate = postQueryData?.postById

  useEffect(() => {
    if (postToUpdate) {
      if (postToUpdate.title) setTitle(postToUpdate.title)
      if (postToUpdate.text) setContent(postToUpdate.text)
      // @ts-ignore FIXME
      if (postToUpdate.image) setImage(postToUpdate.image)
      setCurrentImage(postToUpdate.image)
      setVisibility(postToUpdate.isPublic ? VisibilityType.Public : VisibilityType.Members)
    }
  }, [postToUpdate])

  // create & update
  const [createSpacePost, { loading: loadingCreateMutation }] = useCreateSpacePostMutation({
    onCompleted: () => {
      navigateBack()
    },
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        displayError(error, 'Failed to create space post', {
          location: 'useCreateOrUpdateSpacePost.createSpacePost',
          spaceIdOrName,
        })
      }
    },
    // refetch first page of both the current visibility filter and the ALL filter
    refetchQueries: [
      {
        query: SpacePostsBySpaceIdDocument,
        variables: { idOrName: spaceIdOrName, offset: 0, limit: 10, visibility: visibility },
      },
      {
        query: SpacePostsBySpaceIdDocument,
        variables: { idOrName: spaceIdOrName, offset: 0, limit: 10, visibility: VisibilityFilter.All },
      },
    ],
  })

  const [updateSpacePost, { loading: loadingUpdateMutation }] = useUpdateSpacePostMutation({
    onCompleted: () => navigateBack(),
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        displayError(error, 'Failed to update space post', {
          location: 'useCreateOrUpdateSpacePost.updateSpacePost',
          spaceIdOrName,
          postId,
        })
      }
    },
    refetchQueries: [SpacePostsBySpaceIdDocument],
  })
  const [detectLanguage] = useLazyQuery<DetectLanguageQueryResponse>(detectLanguageQuery)

  const saveSpacePost = async () => {
    const data = await detectLanguage({ variables: { text: content.trim() } })

    const input = {
      title: title.trim() && title.length > 0 ? title : undefined,
      text: content.trim(),
      image: image === null ? null : image?.blob, // null is to remove the image
      visibility: visibility || VisibilityType.Members,
      language: data.data?.detectedLanguage,
    }

    if (postId) {
      return updateSpacePost({ variables: { input: { postId, ...input } } })
    } else {
      return createSpacePost({ variables: { input: { spaceId: space?.id ?? '', ...input } } })
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
    currentImage,
    visibility,
    setTitle,
    setContent,
    setImage,
    setVisibility,
    saveSpacePost,
  }
}

export default useCreateOrUpdateSpacePost
