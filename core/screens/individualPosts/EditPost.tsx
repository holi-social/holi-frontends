import { useMutation, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isMaliciousUrlError, isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { CategorySelection } from '@holi/core/screens/individualPosts/CategorySelection'
import PostInputForm, { Visibility } from '@holi/core/screens/individualPosts/components/PostInputForm'
import { UpdateFeedPostResponse, updateFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { PostQueryResponse, allPostsQuery, myPostsQuery, postQuery } from '@holi/core/screens/individualPosts/queries'
import useFeedPostCategories from '@holi/core/screens/individualPosts/useFeedPostCategories'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Term } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(Visibility.PUBLIC)

  const [description, setDescription] = useState<string>()
  const [title, setTitle] = useState<string>('')
  const [image, setImage] = useState<HoliImageInfo | null>()
  const [currentImage, setCurrentImage] = useState<string>()
  const [selectedTopics, setSelectedTopics] = useState<Term[] | []>()
  const [showCategories, setShowCategories] = useState(false)

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
      openToast(t('individuals.post.edit.success'), HoliToastType.SUCCESS)
      navigateBack()
    },

    refetchQueries: [{ query: myPostsQuery }, { query: allPostsQuery }],
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
          image: image === null ? null : image?.blob,
          topicIds: selectedTopics?.map((topic) => topic.id),
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
      setCurrentImage(post.imageUrl)
      setSelectedCategoryId(post.category.id)
      setSelectedVisibility(Visibility[post.visibility])
      setSelectedTopics(post.topics)
    }
  }, [post])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('individuals.post.edit.title')}
        </HoliHeading>
      ),
      headerTransparent: true,
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

  if (loadingPost) {
    return <HoliLoader />
  }

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH} forceRestrict={user?.id !== post?.author.id}>
      <SpaceTermContextProvider>
        <View style={styles.grayExtendingBackground}>
          {categoriesLoading ? (
            <HoliLoader />
          ) : showCategories ? (
            <CategorySelection
              categories={categories}
              onCategorySelection={selectCategory}
              loading={categoriesLoading}
            />
          ) : (
            <PostInputForm
              title={title}
              onChangeTitle={setTitle}
              description={post?.description}
              onChangeDescription={setDescription}
              image={image || null}
              onChangeImage={(value) => {
                setImage(value)
                setCurrentImage(undefined)
              }}
              mentions={post?.mentionedUsers}
              selectedCategoryId={selectedCategoryId}
              onChangeSelectedCategoryId={setSelectedCategoryId}
              selectedVisibility={selectedVisibility}
              onChangeSelectedVisibility={setSelectedVisibility}
              selectedTopics={selectedTopics}
              onChangeSelectedTopics={setSelectedTopics}
              onSubmit={editPost}
              submitting={submitting}
              currentImage={currentImage}
              onClickCategoriesPill={toggleShowCategories}
              categories={categories}
              isEdit
            />
          )}
        </View>
      </SpaceTermContextProvider>
    </PermissionsGuard>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    grayExtendingBackground: {
      backgroundColor: theme.colors.background20,
      paddingTop: Platform.OS === 'web' ? dimensions.topBarHeight : dimensions.topBarHeight + 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      width: '100%',
    },
  })

export default withProfiler(EditPost, { name: 'EditPost' })
