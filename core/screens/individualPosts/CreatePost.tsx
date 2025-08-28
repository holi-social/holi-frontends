import { useMutation } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import PostInputForm, { Visibility } from '@holi/core/screens/individualPosts/components/PostInputForm'
import { type CreateFeedPostResponse, createFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { ImageAspectRatio } from '@holi/core/screens/individualPosts/types'
import useFeedPostCategories from '@holi/core/screens/individualPosts/useFeedPostCategories'
import PostOnboardModal from '@holi/core/screens/posts/components/PostOnboardModal'
import { usePostOnboarding } from '@holi/core/screens/posts/hooks/usePostOnboarding'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { Text } from 'holi-bricks/components/text'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import RewardMessage from '@holi/core/screens/individualPosts/components/RewardMessage'
import { useGetRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

const CreatePost = () => {
  const { theme } = useTheme()

  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigateBack, navigate } = useRouting()

  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { openToast } = useToast()
  const { track } = useTracking()

  const { loading: categoriesLoading, categories } = useFeedPostCategories()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(Visibility.PUBLIC)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | null>(null)
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(ImageAspectRatio.SIXTEEN_NINE)
  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const { visible, show, hide } = useModalState()
  const { isOnboarded, setIsOnboarded } = usePostOnboarding('post_onboarding_state_value')

  const [isRewardsMessageEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_1)
  const [showRewardMessage, setShowRewardMessage] = useState<boolean>(false)

  const { data, refetch } = useGetRewardsCounterQuery()
  const counter = data?.rewards_counter.counter

  useEffect(() => {
    if (!isOnboarded) {
      show()
    }
  }, [isOnboarded, show])

  const goodDeedCategoryId = useMemo(() => {
    if (!categories) return null
    const goodDeedCategory = categories.find(
      (category) => category.name === t('individuals.post.category.name.goodDeed')
    )
    return goodDeedCategory?.id || null
  }, [categories, t])

  const [createFeedPost] = useMutation<CreateFeedPostResponse>(createFeedPostMutation, {
    onCompleted: () => {
      if (isRewardsMessageEnabled && selectedCategoryId === goodDeedCategoryId) {
        refetch().then(() => {
          track(TrackingEvent.Rewards.goodDeedClaimed('good_deed_post'))
          setShowRewardMessage(true)
        })
      } else {
        openToast(t('individuals.post.input.success'), HoliToastType.SUCCESS)
        navigateBack()
      }
    },
    refetchQueries: [{ query: myPostsQuery }, { query: feedQuery }],
  })

  const createPost = async () => {
    setSubmitting(true)

    createFeedPost({
      variables: {
        input: {
          title,
          description,
          visibility: selectedVisibility,
          categoryId: selectedCategoryId,
          topicsV2: selectedTopics,
          location: selectedLocation?.label,
          aspectRatio,
          imageUrls,
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
      headerShown: !showRewardMessage,
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {t('individuals.post.input.title')}
        </Text>
      ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} fallbackRoute="/" />,
      navigationCustomOptions: {
        footerShown: false,
      },
      headerBackVisible: false,
    })
  }, [colors.background20, colors.black300, navigateBack, setScreenOptions, showRewardMessage, t])

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
  }

  const handleModalClose = () => {
    setIsOnboarded().finally(hide)
  }

  const handleClaimReward = () => {
    navigate('/')
  }

  const handleSubmit = () => {
    setShowRewardMessage(false)
    createPost()
  }

  if (showRewardMessage) {
    return <RewardMessage deedCount={counter} campaignTag="#1MioguteTaten" onClaim={handleClaimReward} />
  }

  return (
    <View style={styles.grayExtendingBackground}>
      {categoriesLoading ? (
        <HoliLoader testID="create-post-loader" />
      ) : (
        <>
          <PostInputForm
            title={title}
            imageUrls={imageUrls}
            onChangeImageUrls={setImageUrls}
            onChangeTitle={setTitle}
            description={description}
            onChangeDescription={setDescription}
            selectedCategoryId={selectedCategoryId}
            onChangeSelectedCategoryId={setSelectedCategoryId}
            selectedVisibility={selectedVisibility}
            onChangeSelectedVisibility={setSelectedVisibility}
            selectedTopics={selectedTopics}
            onChangeSelectedTopics={setSelectedTopics}
            selectedLocation={selectedLocation || undefined}
            onChangeSelectedLocation={setSelectedLocation}
            onSubmit={handleSubmit}
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
    <CreatePost />
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
