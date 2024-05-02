import { useMutation } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, InputAccessoryView, Platform, StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { CategorySelectionModal } from '@holi/core/screens/individualPosts/CategorySelectionModal'
import { PostCreationBar } from '@holi/core/screens/individualPosts/PostCreationBar'
import FeedPostPill, { PostSetting } from '@holi/core/screens/individualPosts/components/FeedPostPill'
import {
  CreateFeedPostResponse,
  CreateFeedPostSchema,
  createFeedPostMutation,
} from '@holi/core/screens/individualPosts/mutations'
import useFeedPostCategories from '@holi/core/screens/individualPosts/useFeedPostCategories'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export enum Visibility {
  PUBLIC = 'PUBLIC',
  REGISTERED_USERS_ONLY = 'REGISTERED_USERS_ONLY',
  //CONNECTIONS_ONLY = 'CONNECTIONS_ONLY',
}

const CreatePost = () => {
  const { theme } = useTheme()
  const windowWidth = Dimensions.get('window').width

  const styles = useMemo(() => getStyles(theme, windowWidth), [theme, windowWidth])
  const { colors } = theme
  const { navigateBack, navigate } = useRouting()

  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { ftEnabled, ftLoading } = useFeatureToggle(FeatureToggleName.INDIVIDUALS_POST)

  const { openToast } = useToast()

  const { loading: categoriesLoading, categories } = useFeedPostCategories()
  const [showCategorySelectionModal, setShowCategorySelectionModal] = useState(true)
  const [selectedCategoryId, setSelectedCategoryIdId] = useState<string | null>(null)

  const [selectedVisibility, setSelectedVisibility] = useState<Visibility>(Visibility.PUBLIC)

  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [isSubmittable, setIsSubmittable] = useState<boolean>(false)

  const [createFeedPost] = useMutation<CreateFeedPostResponse>(createFeedPostMutation, {
    onCompleted: () => {
      openToast(t('comments.success'), HoliToastType.SUCCESS)
      navigate('/')
    },
    onError: (error) => {
      alert(error)
    },
  })

  useEffect(() => {
    const formDataParseResult = CreateFeedPostSchema.safeParse({
      title,
      description,
      visibility: selectedVisibility,
      categoryId: selectedCategoryId,
    })
    setIsSubmittable(formDataParseResult.success)
  }, [title, description, selectedVisibility, selectedCategoryId])

  const createPost = () => {
    setSubmitting(true)
    createFeedPost({
      variables: {
        input: {
          title,
          description,
          visibility: selectedVisibility,
          categoryId: selectedCategoryId,
        },
      },
      onError: () => openToast(t('individuals.post.create.error'), HoliToastType.ERROR),
    })
      .catch(() => {
        openToast(t('individuals.post.create.error'), HoliToastType.ERROR)
      })
      .finally(() => setSubmitting(false))
  }

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('individuals.post.create.title')}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon={Close} onPress={() => navigateBack()} tintColor="black" />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [colors.background20, navigateBack, setScreenOptions, t])

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryIdId(categoryId)
    setShowCategorySelectionModal(false)
  }

  const handlePostSettingsPress = (setting: PostSetting) => {
    if ('visibility' === setting) {
      // toggle this for now
      if (selectedVisibility === Visibility.PUBLIC) {
        setSelectedVisibility(Visibility.REGISTERED_USERS_ONLY)
      } else {
        setSelectedVisibility(Visibility.PUBLIC)
      }
    }
    if ('category' === setting) {
      setShowCategorySelectionModal(true)
    }
  }

  if (!ftLoading && !ftEnabled) {
    navigate('/404')
  }

  if (ftLoading) {
    return null
  }

  const settingPills = [
    {
      label: selectedVisibility && t(`individuals.post.category.label.visibility.${selectedVisibility}`),
      filterType: 'visibility',
    },
    {
      label: categories?.find((category) => category.id === selectedCategoryId)?.name ?? selectedCategoryId,
      filterType: 'category',
    },
  ]

  const inputAccessoryViewID = 'inputAccessoryViewID'

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.INDIVIDUALS_POST} featureNameKey="individual_posts" noLayout>
      <View style={styles.layout}>
        <View style={styles.container}>
          <View style={styles.pillContainer}>
            {settingPills.map((pill, index) => (
              <FeedPostPill
                key={index}
                label={pill.label}
                setting={pill.filterType as PostSetting}
                onPress={handlePostSettingsPress}
              />
            ))}
          </View>
          <View style={styles.inputContainer}>
            <HoliTextInput
              placeholder={t('individuals.post.create.category.input.title')}
              fontStyle={styles.titleFont}
              inputStyle={styles.titleInput}
              placeholderColor={theme.colors.gray300}
              aria-label={t('individuals.post.create.category.input.title')}
              inputAccessoryViewID={inputAccessoryViewID}
              onChange={(title) => setTitle(title)}
            />
            <HoliRichTextInput
              placeholder={t('individuals.post.create.category.input.description')}
              style={styles.descriptionInput}
              aria-label={t('individuals.post.create.category.input.description')}
              inputAccessoryViewID={inputAccessoryViewID}
              onChange={(description) => setDescription(description)}
              placeholderTextColor={theme.colors.gray300}
              showCharacterCount
              maxNoOfCharacters={5000}
              maxSuggestionOptions={30}
            />
            {/* <PortalGate gateName="suggestions" style={[styles.suggestionsScrollView]} /> */}
          </View>
        </View>

        {Platform.OS === 'ios' ? (
          <InputAccessoryView nativeID={inputAccessoryViewID} backgroundColor={theme.colors.background10}>
            <PostCreationBar onCreatePost={createPost} submitting={submitting} isSubmittable={isSubmittable} />
          </InputAccessoryView>
        ) : (
          <PostCreationBar onCreatePost={createPost} submitting={submitting} isSubmittable={isSubmittable} />
        )}
        {!categoriesLoading && categories && (
          <CategorySelectionModal
            show={showCategorySelectionModal}
            categories={categories}
            onCategorySelection={selectCategory}
          />
        )}
      </View>
    </FeatureToggleGuard>
  )
}

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 64
const SUGGESTIONS_DROPDOWN_HEIGHT = 150
const SMALL_DEVICE_HEIGHT = 600

const getStyles = (theme: HoliTheme, screenHeight: number) =>
  StyleSheet.create({
    // general styles
    text: {
      fontSize: 16,
    },
    layout: {
      backgroundColor: theme.colors.background20,
      paddingTop: Platform.OS === 'web' ? dimensions.topBarHeight : dimensions.topBarHeight + 40,
      alignItems: 'center',
      height: '100%',
    },

    // input styles
    titleInput: {
      backgroundColor: theme.colors.background20,
      borderWidth: 0,
      paddingVertical: 4,
      maxWidth: '100%',
    },
    descriptionInput: {
      backgroundColor: theme.colors.background20,
      borderWidth: 0,
      paddingTop: 2,
      paddingHorizontal: 5,
      maxWidth: '100%',
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      paddingTop: 24,
      width: '100%',
      ...Platform.select({
        web: {
          maxWidth: dimensions.breakpointM,
        },
      }),
    },
    inputContainer: {
      width: '100%',
      paddingHorizontal: 6,
    },
    titleFont: {
      fontSize: 21,
      color: theme.colors.black300,
    },

    // pill styles
    pillContainer: {
      width: '100%',
      flexWrap: 'wrap',
      marginTop: 12,
      marginBottom: 24,
      flexDirection: 'row',
      zIndex: 1,
      gap: 8,
      paddingHorizontal: 16,
    },

    suggestionsScrollView: {
      zIndex: screenHeight < SMALL_DEVICE_HEIGHT ? 3 : undefined,
      width: '100%',
      height: SUGGESTIONS_DROPDOWN_HEIGHT,
      maxHeight: SUGGESTIONS_DROPDOWN_HEIGHT,
      paddingTop: 10,
      marginBottom: screenHeight < SMALL_DEVICE_HEIGHT ? -75 : -10,
      paddingBottom: 10,
      backgroundColor: theme.colors.background10,
      shadowColor: theme.colors.foreground30,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      borderRadius: 12,
      elevation: 4,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      ...Platform.select({
        web: {
          maxWidth: dimensions.maxScreenWidth,
          marginHorizontal: 'auto',
        },
      }),
      position: 'absolute',
      bottom: SUBMIT_BUTTON_CONTAINER_HEIGHT,
      left: 0,
      right: 0,
    },
  })

export default withProfiler(CreatePost, { name: 'CreatePost' })
