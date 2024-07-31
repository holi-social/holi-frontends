import { useLazyQuery, useMutation } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { DetectLanguageQueryResponse, detectLanguageQuery } from '@holi/core/queries'
import { CategorySelection } from '@holi/core/screens/individualPosts/CategorySelection'
import PostInputForm, { Visibility } from '@holi/core/screens/individualPosts/components/PostInputForm'
import { CreateFeedPostResponse, createFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { allPostsQuery, myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import useFeedPostCategories from '@holi/core/screens/individualPosts/useFeedPostCategories'
import PostOnboardModal from '@holi/core/screens/posts/components/PostOnboardModal'
import { usePostOnboarding } from '@holi/core/screens/posts/hooks/usePostOnboarding'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Term } from '@holi/core/screens/userprofile/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const CreatePost = () => {
  const { theme } = useTheme()

  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigateBack } = useRouting()

  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { openToast } = useToast()
  const { track } = useTracking()

  const { loading: categoriesLoading, categories } = useFeedPostCategories()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(Visibility.PUBLIC)
  const [selectedTopics, setSelectedTopics] = useState<Term[]>([])

  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [image, setImage] = useState<HoliImageInfo | null>(null)
  const [showCategories, setShowCategories] = useState(true)
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
      track(TrackingEvent.FeedPosts.created)
      navigateBack()
    },
    refetchQueries: [{ query: myPostsQuery }, { query: allPostsQuery }],
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
          image: image?.blob,
          topicIds: selectedTopics.map((topic) => topic.id),
          language: data?.detectedLanguage,
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
      headerTransparent: false,
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('individuals.post.input.title')}
        </HoliHeading>
      ),
      headerLeft: () => <HeaderBackButton icon={Close} onPress={() => navigateBack()} tintColor={colors.black300} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [colors.background20, colors.black300, navigateBack, setScreenOptions, t])

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setShowCategories(false)
  }

  const toggleShowCategories = () => {
    setShowCategories((value) => !value)
  }

  const handleModalClose = () => {
    setIsOnboarded().finally(hide)
  }

  return (
    <View style={styles.grayExtendingBackground}>
      {showCategories ? (
        <CategorySelection loading={categoriesLoading} categories={categories} onCategorySelection={selectCategory} />
      ) : (
        <PostInputForm
          title={title}
          onChangeTitle={setTitle}
          description={description}
          onChangeDescription={setDescription}
          image={image}
          onChangeImage={setImage}
          selectedCategoryId={selectedCategoryId}
          onChangeSelectedCategoryId={setSelectedCategoryId}
          selectedVisibility={selectedVisibility}
          onChangeSelectedVisibility={setSelectedVisibility}
          selectedTopics={selectedTopics}
          onChangeSelectedTopics={setSelectedTopics}
          onSubmit={createPost}
          submitting={submitting}
          categories={categories}
          onClickCategoriesPill={toggleShowCategories}
        />
      )}
      <PostOnboardModal visible={visible} handleModalClose={handleModalClose} />
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
