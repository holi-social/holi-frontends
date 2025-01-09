import { useLazyQuery, useMutation } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import type { Term } from '@holi/core/domain/shared/types'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { type DetectLanguageQueryResponse, detectLanguageQuery } from '@holi/core/queries'
import PostInputForm, { Visibility } from '@holi/core/screens/individualPosts/components/PostInputForm'
import { type CreateFeedPostResponse, createFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { allPostsQuery, myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { ImageAspectRatio } from '@holi/core/screens/individualPosts/types'
import useFeedPostCategories from '@holi/core/screens/individualPosts/useFeedPostCategories'
import PostOnboardModal from '@holi/core/screens/posts/components/PostOnboardModal'
import { usePostOnboarding } from '@holi/core/screens/posts/hooks/usePostOnboarding'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { Text } from 'holi-bricks/components/text'

const CreatePost = () => {
  const { theme } = useTheme()

  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigateBack } = useRouting()

  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { openToast } = useToast()

  const { loading: categoriesLoading, categories } = useFeedPostCategories()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(Visibility.PUBLIC)
  const [selectedTopics, setSelectedTopics] = useState<Term[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | null>(null)
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(ImageAspectRatio.SIXTEEN_NINE)
  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [images, setImages] = useState<HoliImageInfo[]>([])
  const { visible, show, hide } = useModalState()
  const { isOnboarded, setIsOnboarded } = usePostOnboarding('post_onboarding_state_value')

  useEffect(() => {
    if (!isOnboarded) {
      show()
    }
  }, [isOnboarded, show])

  const [createFeedPost] = useMutation<CreateFeedPostResponse>(createFeedPostMutation, {
    onCompleted: () => {
      openToast(t('individuals.post.input.success'), HoliToastType.SUCCESS)
      navigateBack()
    },
    refetchQueries: [{ query: myPostsQuery }, { query: allPostsQuery }, { query: feedQuery }],
  })

  const [detectLanguage] = useLazyQuery<DetectLanguageQueryResponse>(detectLanguageQuery)

  const createPost = async () => {
    setSubmitting(true)
    const { data } = await detectLanguage({ variables: { text: description } })
    createFeedPost({
      variables: {
        input: {
          title,
          description,
          visibility: selectedVisibility,
          categoryId: selectedCategoryId,
          topicIds: selectedTopics.map((topic) => topic.id),
          language: data?.detectedLanguage,
          location: selectedLocation?.label,
          images: images.map((_image, index) => {
            return { image: _image.blob, order: index, aspectRatio }
          }),
          geolocation: selectedLocation
            ? {
                latitude: selectedLocation.coordinates?.latitude,
                longitude: selectedLocation.coordinates?.longitude,
              }
            : undefined,
        },
      },
      onError: (error) => {
        if (isMaliciousUrlError(error)) {
          openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
        } else {
          openToast(t('individuals.post.input.error'), HoliToastType.ERROR)
        }
      },
    })
      .catch(() => {
        openToast(t('individuals.post.input.error'), HoliToastType.ERROR)
      })
      .finally(() => setSubmitting(false))
  }

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {t('individuals.post.input.title')}
        </Text>
      ),
      navigationCustomOptions: {
        footerShown: false,
      },
      headerBackVisible: false,
    })
  }, [colors.background20, colors.black300, navigateBack, setScreenOptions, t])

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
  }

  const handleModalClose = () => {
    setIsOnboarded().finally(hide)
  }

  return (
    <View style={styles.grayExtendingBackground}>
      {categoriesLoading ? (
        <HoliLoader />
      ) : (
        <>
          <PostInputForm
            title={title}
            onChangeTitle={setTitle}
            description={description}
            onChangeDescription={setDescription}
            images={images}
            onChangeImages={setImages}
            selectedCategoryId={selectedCategoryId}
            onChangeSelectedCategoryId={setSelectedCategoryId}
            selectedVisibility={selectedVisibility}
            onChangeSelectedVisibility={setSelectedVisibility}
            selectedTopics={selectedTopics}
            onChangeSelectedTopics={setSelectedTopics}
            selectedLocation={selectedLocation || undefined}
            onChangeSelectedLocation={setSelectedLocation}
            onSubmit={createPost}
            submitting={submitting}
            categories={categories}
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            selectCategory={selectCategory}
          />
          <PostOnboardModal visible={visible} handleModalClose={handleModalClose} />
        </>
      )}
    </View>
  )
}

const WrappedCreatePost = () => (
  <PermissionsGuard permissionType={PermissionsType.AUTH}>
    <SpaceTermContextProvider>
      <CreatePost />
    </SpaceTermContextProvider>
  </PermissionsGuard>
)

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

export default withProfiler(WrappedCreatePost, { name: 'CreatePost' })
