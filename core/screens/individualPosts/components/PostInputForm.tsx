import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import { CategorySelectionModal } from '@holi/core/screens/individualPosts/CategorySelectionModal'
import FeedPostPill from '@holi/core/screens/individualPosts/components/FeedPostPill'
import ImageEditor from '@holi/core/screens/individualPosts/components/ImageEditor'
import { SubmitPostBar } from '@holi/core/screens/individualPosts/components/SubmitPostBar'
import {
  FEED_POST_DESCRIPTION_MAX_CHARACTERS,
  FEED_POST_TITLE_MAX_CHARACTERS,
  FeedPostSchema,
} from '@holi/core/screens/individualPosts/mutations'
import useFeedPostCategories from '@holi/core/screens/individualPosts/useFeedPostCategories'
import { Global, HoliLogoFilled } from '@holi/icons/src/generated'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

// the title input doesn't allow line breaks but we need give it a maxNoOfCharacters={2} in order to avoid a horizontal scroll
// this method disables any manual line breaks while the input still automatically breaks the line if it doesn't fit
const removeTitlelines = (inputString: string) => {
  return inputString.replace(/\n/g, '')
}

export enum Visibility {
  PUBLIC = 'PUBLIC',
  REGISTERED_USERS_ONLY = 'REGISTERED_USERS_ONLY',
  //CONNECTIONS_ONLY = 'CONNECTIONS_ONLY',
}

export interface PostInputFormProps {
  title: string
  description: string
  image: HoliImageInfo | null
  selectedVisibility: Visibility
  selectedCategoryId: string | null
  currentImage?: string
  onChangeTitle: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeSelectedVisibility: (_: Visibility) => void
  onChangeImage: (image: HoliImageInfo | null) => void
  onChangeSelectedCategoryId: (_: string) => void
  onSubmit: () => void
  isEdit?: boolean
  fieldErrors?: TranslatedFieldErrors
  submitting: boolean
}

const PostInputForm: React.FC<PostInputFormProps> = ({
  title,
  description,
  image,
  selectedVisibility,
  selectedCategoryId,
  currentImage,
  onChangeTitle,
  onChangeDescription,
  onChangeSelectedVisibility,
  onChangeSelectedCategoryId,
  onChangeImage,
  onSubmit,
  isEdit = false,
  submitting,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const styles = useMemo(() => getStyles(theme), [theme])

  const { loading: categoriesLoading, categories } = useFeedPostCategories()
  const [showCategorySelectionModal, setShowCategorySelectionModal] = useState(false)
  const [isSubmittable, setIsSubmittable] = useState<boolean>(false)
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const { show: showVisibility, hide: hideVisibility, visible: visibleVisibility } = useModalState()

  useEffect(() => {
    const formDataParseResult = FeedPostSchema.safeParse({
      visibility: selectedVisibility,
      categoryId: selectedCategoryId,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    })
    setIsSubmittable(formDataParseResult.success)

    if (!formDataParseResult.success) {
      setFieldErrors(formDataParseResult.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [title, description, selectedVisibility, selectedCategoryId])

  useEffect(() => {
    if (!isEdit) {
      const timer = setTimeout(() => {
        setShowCategorySelectionModal(true)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isEdit])

  const visibilityOptions: HoliModalSelectOption<Visibility>[] = [
    {
      id: Visibility.PUBLIC,
      title: t(`individuals.post.input.visibility.${Visibility.PUBLIC}.title`),
      description: t(`individuals.post.input.visibility.${Visibility.PUBLIC}.description`),
      selected: selectedVisibility === Visibility.PUBLIC,
      icon: Global,
    },
    {
      id: Visibility.REGISTERED_USERS_ONLY,
      title: t(`individuals.post.input.visibility.${Visibility.REGISTERED_USERS_ONLY}.title`),
      description: t(`individuals.post.input.visibility.${Visibility.REGISTERED_USERS_ONLY}.description`),
      selected: selectedVisibility === Visibility.REGISTERED_USERS_ONLY,
      icon: HoliLogoFilled,
    },
  ]

  const submit = () => {
    onSubmit()
  }

  const selectCategory = (categoryId: string) => {
    onChangeSelectedCategoryId(categoryId)
    setShowCategorySelectionModal(false)
  }

  const handleChangeVisibility = (option: HoliModalSelectOption<Visibility>) => onChangeSelectedVisibility(option.id)

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.layout}>
        <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
          <View style={styles.pillContainer}>
            <FeedPostPill
              label={t(`individuals.post.category.label.visibility.${selectedVisibility}`)}
              setting={'visibility'}
              onPress={showVisibility}
            />
            <FeedPostPill
              label={categories?.find((category) => category.id === selectedCategoryId)?.name ?? selectedCategoryId}
              setting={'category'}
              onPress={() => setShowCategorySelectionModal(true)}
            />
          </View>
          <View style={styles.inputContainer}>
            <HoliTextInput
              placeholder={t('individuals.post.input.category.input.title')}
              fontStyle={styles.titleFont}
              inputStyle={styles.titleInput}
              placeholderColor={theme.colors.gray300}
              aria-label={t('individuals.post.input.category.input.title')}
              onChange={(input) => onChangeTitle(removeTitlelines(input))}
              value={title}
              maxNoOfCharacters={FEED_POST_TITLE_MAX_CHARACTERS}
              maxNoOfVisibleLines={3}
              noOfVisibleLines={2}
            />
            <HoliTextInput
              placeholder={t('individuals.post.input.category.input.description')}
              inputStyle={styles.descriptionInput}
              aria-label={t('individuals.post.input.category.input.description')}
              onChange={onChangeDescription}
              placeholderColor={theme.colors.gray300}
              showCharacterCount
              value={description}
              maxNoOfCharacters={FEED_POST_DESCRIPTION_MAX_CHARACTERS}
              validationErrorText={
                description && fieldErrors?.description?.length ? fieldErrors.description[0] : undefined
              }
              maxNoOfVisibleLines={16}
            />
            <View style={styles.imageEditor}>
              <ImageEditor onSave={onChangeImage} image={image} currentImage={currentImage} />
            </View>
          </View>
        </ScrollView>

        <SubmitPostBar
          onSubmit={submit}
          onSetImage={onChangeImage}
          hasSetImage={!!image}
          submitting={submitting}
          isSubmittable={isSubmittable}
          isEdit={isEdit}
        />
        {!categoriesLoading && categories && (
          <CategorySelectionModal
            show={showCategorySelectionModal}
            categories={categories}
            onCategorySelection={selectCategory}
          />
        )}
      </KeyboardAvoidingView>
      <HoliModalSelect
        options={visibilityOptions}
        title={t('individuals.post.input.visibility.title')}
        description={t('individuals.post.input.visibility.description')}
        onChange={handleChangeVisibility}
        label={t('individuals.post.input.visibility.title')}
        testID="post-visibility-input"
        isRequired
        hideButton
        show={showVisibility}
        hide={hideVisibility}
        visible={visibleVisibility}
      />
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layout: {
      backgroundColor: theme.colors.background20,
      paddingTop: Platform.OS === 'web' ? dimensions.topBarHeight : dimensions.topBarHeight + 40,
      alignItems: 'center',
      height: '100%',
    },
    titleInput: {
      backgroundColor: theme.colors.background20,
      borderWidth: 0,
      paddingVertical: Spacing['3xs'],
      maxWidth: '100%',
    },
    titleFont: {
      fontSize: 21,
      color: theme.colors.black300,
    },
    descriptionInput: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      paddingTop: 6,
      paddingHorizontal: 10,
      maxWidth: '100%',
    },
    container: {
      paddingTop: 24,
      width: '100%',
      ...Platform.select({
        web: {
          maxWidth: dimensions.breakpointM,
        },
      }),
    },
    contentContainer: {
      paddingBottom: Platform.OS === 'ios' ? dimensions.bottomBarHeight : dimensions.bottomBarHeight + 60,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    inputContainer: {
      width: '100%',
      paddingHorizontal: 6,
    },
    imageEditor: {
      paddingTop: 24,
    },
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
  })

export default withProfiler(PostInputForm, { name: 'PostInputForm' })
