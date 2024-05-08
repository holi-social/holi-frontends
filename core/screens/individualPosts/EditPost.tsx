import { useMutation, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import PostInputForm, { Visibility } from '@holi/core/screens/individualPosts/components/PostInputForm'
import { UpdateFeedPostResponse, updateFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { PostQueryResponse, feedPostsQuery, myPostsQuery, postQuery } from '@holi/core/screens/individualPosts/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { useTheme } from '@holi/ui/styles/theme'

export type EditPostParams = {
  idOrSlug: string
}

const { useParam } = createParamHooks<EditPostParams>()

const EditPost = () => {
  const [idOrSlug] = useParam('idOrSlug')
  const { theme } = useTheme()

  const { colors } = theme
  const { navigateBack, navigate, replaceRoute } = useRouting()
  const { user } = useLoggedInUser()

  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { ftEnabled, ftLoading } = useFeatureToggle(FeatureToggleName.INDIVIDUALS_POST)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { openToast } = useToast()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(Visibility.PUBLIC)

  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [image, setImage] = useState<HoliImageInfo | null>()
  const [currentImage, setCurrentImage] = useState<string>()

  const { data: { post } = {}, loading: loadingPost } = useQuery<PostQueryResponse>(postQuery, {
    variables: { idOrSlug },
    skip: !idOrSlug,
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load quote', { location: 'EditPost.postQuery', idOrSlug })
    },
  })

  const [updateFeedPost] = useMutation<UpdateFeedPostResponse>(updateFeedPostMutation, {
    onCompleted: () => {
      openToast(t('individuals.post.input.success'), HoliToastType.SUCCESS)
      navigateBack()
    },
    onError: (error) => {
      alert(error)
    },
    refetchQueries: [{ query: myPostsQuery }, 'MyPosts', { query: feedPostsQuery }],
  })

  const editPost = () => {
    setSubmitting(true)
    updateFeedPost({
      variables: {
        input: {
          title,
          description,
          visibility: selectedVisibility,
          categoryId: selectedCategoryId,
          postId: post?.id,
          image: image?.blob,
        },
      },
      onError: () => openToast(t('individuals.post.input.error'), HoliToastType.ERROR),
    })
      .catch(() => {
        openToast(t('individuals.post.input.error'), HoliToastType.ERROR)
      })
      .finally(() => setSubmitting(false))
  }

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setDescription(post.description)
      setCurrentImage(post.image)
      setSelectedCategoryId(post.category.id)
    }
  }, [post])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('individuals.post.input.title')}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon={Close} onPress={() => navigateBack()} tintColor={colors.black300} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [colors.background20, colors.black300, navigateBack, setScreenOptions, t])

  if (!ftLoading && !ftEnabled) {
    navigate('/404')
  }

  if (ftLoading || loadingPost) {
    return <HoliLoader />
  }

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH} forceRestrict={user?.id !== post?.creator.id}>
      <FeatureToggleGuard toggleName={FeatureToggleName.INDIVIDUALS_POST} featureNameKey="individual_posts" noLayout>
        <PostInputForm
          title={title}
          onChangeTitle={setTitle}
          description={description}
          onChangeDescription={setDescription}
          image={image || null}
          onChangeImage={setImage}
          selectedCategoryId={selectedCategoryId}
          onChangeSelectedCategoryId={setSelectedCategoryId}
          selectedVisibility={selectedVisibility}
          onChangeSelectedVisibility={setSelectedVisibility}
          onSubmit={editPost}
          submitting={submitting}
          currentImage={currentImage}
          isEdit
        />
      </FeatureToggleGuard>
    </PermissionsGuard>
  )
}

export default withProfiler(EditPost, { name: 'EditPost' })
