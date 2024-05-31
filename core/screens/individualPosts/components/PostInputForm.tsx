import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import { PortalGate } from '@holi/core/providers/PortalProvider'
import FeedPostPill from '@holi/core/screens/individualPosts/components/FeedPostPill'
import ImageEditor from '@holi/core/screens/individualPosts/components/ImageEditor'
import { SubmitPostBar } from '@holi/core/screens/individualPosts/components/SubmitPostBar'
import {
  FEED_POST_DESCRIPTION_MAX_CHARACTERS,
  FEED_POST_TITLE_MAX_CHARACTERS,
  FeedPostSchema,
} from '@holi/core/screens/individualPosts/mutations'
import { FeedPostCategories } from '@holi/core/screens/individualPosts/useFeedPostCategories'
import { Global, HoliLogoFilled } from '@holi/icons/src/generated'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'
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
  categories: FeedPostCategories | null
  onClickCategoriesPill: () => void
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
  onChangeImage,
  onSubmit,
  isEdit = false,
  submitting,
  categories,
  onClickCategoriesPill,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const styles = useMemo(() => getStyles(theme), [theme])

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

  const handleChangeVisibility = (option: HoliModalSelectOption<Visibility>) => onChangeSelectedVisibility(option.id)

  const categoryLabel = categories?.find((category) => category.id === selectedCategoryId)?.label ?? selectedCategoryId

  const descriptionPlaceholder =
    categories?.find((category) => category.id === selectedCategoryId)?.description ??
    t('individuals.post.input.category.input.description')

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
            <FeedPostPill label={categoryLabel} setting={'category'} onPress={onClickCategoriesPill} />
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
              validationErrorText={title && fieldErrors?.title?.length ? fieldErrors.title[0] : undefined}
            />
            <HoliRichTextInput
              placeholder={descriptionPlaceholder}
              inputStyle={styles.descriptionInput}
              aria-label={descriptionPlaceholder}
              onChange={onChangeDescription}
              placeholderTextColor={theme.colors.gray300}
              showCharacterCount
              maxNoOfCharacters={FEED_POST_DESCRIPTION_MAX_CHARACTERS}
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
      </KeyboardAvoidingView>
      {/* Suggestions*/}
      <PortalGate gateName="suggestions" style={[styles.suggestionsScrollView]} />
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
      width: '100%',
      height: '100%',
      alignItems: 'center',
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
      borderColor: 'transparent',
      borderWidth: 0,
      paddingTop: 6,
      paddingHorizontal: 10,
      maxWidth: '100%',
    },
    container: {
      width: '100%',
      ...Platform.select({
        web: {
          maxWidth: dimensions.breakpointM,
        },
      }),
    },
    contentContainer: {
      paddingBottom: Platform.OS === 'ios' ? dimensions.bottomBarHeight : dimensions.bottomBarHeight + 60,
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
      marginTop: Platform.OS === 'web' ? Spacing.xs : Spacing.md,
      marginBottom: 24,
      flexDirection: 'row',
      zIndex: 1,
      gap: 8,
      paddingHorizontal: 16,
    },
    suggestionsScrollView: {
      zIndex: 1,
      width: '100%',
      height: 150,
      maxHeight: 150,
      paddingTop: 10,
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
      bottom: Platform.OS === 'web' ? 64 : 96,
      left: 0,
      right: 0,
    },
  })

export default withProfiler(PostInputForm, { name: 'PostInputForm' })
