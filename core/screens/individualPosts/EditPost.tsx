import { useMutation, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isMaliciousUrlError, isNotFoundError, logError } from '@holi/core/errors/helpers'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import PostInputForm, { Visibility } from '@holi/core/screens/individualPosts/components/PostInputForm'
import { type UpdateFeedPostResponse, updateFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import {
  type PostQueryResponse,
  allPostsQuery,
  myPostsQuery,
  postQuery,
} from '@holi/core/screens/individualPosts/queries'
import { ImageAspectRatio } from '@holi/core/screens/individualPosts/types'
import useFeedPostCategories from '@holi/core/screens/individualPosts/useFeedPostCategories'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type EditPostParams = {
  idOrSlug: string
}

const { useParam } = createParamHooks<EditPostParams>()

const EditPost = () => {
  const [idOrSlug] = useParam('idOrSlug')
  const { theme } = useTheme()

  const styles = useMemo(() => getStyles(theme), [theme])

  const { colors } = theme
  const { navigateBack, replaceRoute } = useRouting()
  const { user } = useLoggedInUser()

  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { openToast } = useToast()

  const { loading: categoriesLoading, categories } = useFeedPostCategories()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(Visibility.PUBLIC)
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(ImageAspectRatio.SIXTEEN_NINE)
  const [description, setDescription] = useState<string>()
  const [title, setTitle] = useState<string>('')
  const [selectedTopics, setSelectedTopics] = useState<string[] | []>()
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>()

  const {
    data: { post } = {},
    loading: loadingPost,
  } = useQuery<PostQueryResponse>(postQuery, {
    variables: { idOrSlug },
    skip: !idOrSlug,
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load quote', {
        location: 'EditPost.postQuery',
        idOrSlug,
      })
    },
  })

  const [updateFeedPost] = useMutation<UpdateFeedPostResponse>(updateFeedPostMutation, {
    onCompleted: () => {
      openToast(t('individuals.post.edit.success'), HoliToastType.SUCCESS)
      navigateBack()
    },

    refetchQueries: [{ query: myPostsQuery }, { query: allPostsQuery }],
  })

  const editPost = async () => {
    setSubmitting(true)

    updateFeedPost({
      variables: {
        input: {
          title,
          description,
          visibility: selectedVisibility,
          categoryId: selectedCategoryId,
          postId: post?.id,
          imageUrls,
          topicsV2: selectedTopics,

          location: selectedLocation?.label || '',
          geolocation: {
            latitude: selectedLocation?.coordinates?.latitude || 0,
            longitude: selectedLocation?.coordinates?.longitude || 0,
          },
        },
      },
      onError: (error) => {
        if (isMaliciousUrlError(error)) {
          openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
        } else {
          openToast(t('individuals.post.edit.error'), HoliToastType.ERROR)
        }
      },
    })
      .catch(() => {
        openToast(t('individuals.post.edit.error'), HoliToastType.ERROR)
      })
      .finally(() => setSubmitting(false))
  }

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setDescription(post.description)
      setImageUrls(post.imageUrls || [])
      setSelectedCategoryId(post.category?.id || null)
      setSelectedVisibility(Visibility[post.visibility])
      setSelectedTopics(post.topicsV2)
      setSelectedLocation({
        label: post.location || '',
        id: '',
        coordinates: post.geolocation || undefined,
      })
      setAspectRatio(post.images?.[0]?.aspectRatio || ImageAspectRatio.SIXTEEN_NINE) // all images should be the same aspect ratio
    }
  }, [post])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('individuals.post.edit.title')}
        </HoliHeading>
      ),
      headerLeft: () => <HeaderBackButton icon={Close} tintColor={colors.black300} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [colors.background20, colors.black300, navigateBack, setScreenOptions, t])

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
  }

  if (loadingPost) {
    return <HoliLoader />
  }

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH} forceRestrict={user?.id !== post?.author.id}>
      <View style={styles.grayExtendingBackground}>
        {categoriesLoading ? (
          <HoliLoader />
        ) : (
          <PostInputForm
            title={title}
            onChangeTitle={setTitle}
            description={description || post?.description}
            onChangeDescription={setDescription}
            imageUrls={imageUrls}
            onChangeImageUrls={setImageUrls}
            mentions={post?.mentionedUsers}
            selectedCategoryId={selectedCategoryId}
            onChangeSelectedCategoryId={setSelectedCategoryId}
            selectedVisibility={selectedVisibility}
            onChangeSelectedVisibility={setSelectedVisibility}
            selectedTopics={selectedTopics}
            onChangeSelectedTopics={setSelectedTopics}
            selectedLocation={selectedLocation}
            onChangeSelectedLocation={setSelectedLocation as (_: GeolocationSuggestion | null) => void}
            onSubmit={editPost}
            submitting={submitting}
            categories={categories}
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            selectCategory={selectCategory}
            isEdit
          />
        )}
      </View>
    </PermissionsGuard>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    grayExtendingBackground: {
      backgroundColor: theme.colors.background20,
      paddingTop: Platform.OS === 'web' ? dimensions.topBarHeight : 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      width: '100%',
    },
  })

export default withProfiler(EditPost, { name: 'EditPost' })
