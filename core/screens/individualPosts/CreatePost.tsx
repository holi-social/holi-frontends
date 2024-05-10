import { useMutation } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import PostInputForm, { Visibility } from '@holi/core/screens/individualPosts/components/PostInputForm'
import { CreateFeedPostResponse, createFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { feedPostsQuery, myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { useTheme } from '@holi/ui/styles/theme'

const CreatePost = () => {
  const { theme } = useTheme()

  const { colors } = theme
  const { navigateBack, navigate } = useRouting()

  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { ftEnabled, ftLoading } = useFeatureToggle(FeatureToggleName.INDIVIDUALS_POST)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { openToast } = useToast()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(Visibility.PUBLIC)

  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [image, setImage] = useState<HoliImageInfo | null>(null)

  const [createFeedPost] = useMutation<CreateFeedPostResponse>(createFeedPostMutation, {
    onCompleted: () => {
      openToast(t('individuals.post.input.success'), HoliToastType.SUCCESS)
      navigate('/')
    },
    onError: (error) => {
      alert(error)
    },
    refetchQueries: [{ query: myPostsQuery }, { query: feedPostsQuery }],
  })

  const createPost = () => {
    setSubmitting(true)
    createFeedPost({
      variables: {
        input: {
          title,
          description,
          visibility: selectedVisibility,
          categoryId: selectedCategoryId,
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

  if (ftLoading) {
    return <></>
  }

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.INDIVIDUALS_POST} featureNameKey="individual_posts" noLayout>
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
        onSubmit={createPost}
        submitting={submitting}
      />
    </FeatureToggleGuard>
  )
}

export default withProfiler(CreatePost, { name: 'CreatePost' })
