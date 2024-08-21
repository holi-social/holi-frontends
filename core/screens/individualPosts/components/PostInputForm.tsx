import { withProfiler } from '@sentry/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'

import FormWrapper from '@holi/core/components/FormWrapper'
import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { PortalGate } from '@holi/core/providers/PortalProvider'
import EditUploadedImages from '@holi/core/screens/individualPosts/components/EditUploadedImages'
import FeedPostPill from '@holi/core/screens/individualPosts/components/FeedPostPill'
import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import PostLocationCard from '@holi/core/screens/individualPosts/components/PostLocationCard'
import PostTopics from '@holi/core/screens/individualPosts/components/PostTopics'
import { SubmitPostBar } from '@holi/core/screens/individualPosts/components/SubmitPostBar'
import {
  FEED_POST_DESCRIPTION_MAX_CHARACTERS,
  FEED_POST_TITLE_MAX_CHARACTERS,
  FeedPostSchema,
} from '@holi/core/screens/individualPosts/mutations'
import { FeedPostCategories } from '@holi/core/screens/individualPosts/useFeedPostCategories'
import { Term, User } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2, Global, HoliLogoFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
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
  description?: string
  image: HoliImageInfo | null
  images: HoliImageInfo[]
  selectedVisibility: Visibility
  selectedCategoryId: string | null
  currentImage?: string
  selectedTopics?: Term[]
  selectedLocation?: GeolocationSuggestion
  onChangeTitle: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeSelectedVisibility: (_: Visibility) => void
  onChangeImage: (image: HoliImageInfo | null) => void
  onChangeImages: any
  onChangeSelectedTopics: (_: Term[]) => void
  onChangeSelectedCategoryId: (_: string) => void
  onChangeSelectedLocation: (_: GeolocationSuggestion) => void
  onSubmit: () => void
  isEdit?: boolean
  fieldErrors?: TranslatedFieldErrors
  submitting: boolean
  categories: FeedPostCategories | null
  onClickCategoriesPill: () => void
  mentions?: User[]
}

const PostInputForm: React.FC<PostInputFormProps> = ({
  title,
  description,
  image,
  images,
  mentions = [],
  selectedVisibility,
  selectedCategoryId,
  selectedLocation,
  currentImage,
  selectedTopics,
  onChangeTitle,
  onChangeDescription,
  onChangeSelectedVisibility,
  onChangeImage,
  onChangeImages,
  onChangeSelectedTopics,
  onChangeSelectedLocation,
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

  const { show: showVisibility, hide: hideVisibility, visible: visibleVisibility } = useModalState()
  const { show: showTopicsModal, hide: hideTopicsModal, visible: visibleTopicsModal } = useModalState()
  const { show: showLocationModal, hide: hideLocationModal, visible: visibleLocationModal } = useModalState()
  const { show: showEditImagesModal, hide: hideEditImagesModal, visible: visibleEditImagesModal } = useModalState()

  useEffect(() => {
    const formDataParseResult = FeedPostSchema.safeParse({
      visibility: selectedVisibility,
      categoryId: selectedCategoryId,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    })
    setIsSubmittable(formDataParseResult.success)
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

  const handleLocationChange = (selected?: GeolocationSuggestion) => {
    selected ? onChangeSelectedLocation(selected) : onChangeSelectedLocation(null)
  }

  const onSaveLocation = () => {
    handleLocationChange(selectedLocation)
    hideLocationModal()
  }

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

            {selectedTopics &&
              (selectedTopics?.length < 1 ? (
                <FeedPostPill setting={'topic'} onPress={showTopicsModal} />
              ) : (
                <FeedPostPill
                  label={`${selectedTopics.length} ${selectedTopics.length > 1 ? ' Topics' : 'Topic'}`}
                  setting={'topic'}
                  onPress={showTopicsModal}
                />
              ))}
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

            <HoliRichTextInput
              placeholder={descriptionPlaceholder}
              inputStyle={styles.descriptionInput}
              aria-label={descriptionPlaceholder}
              onChange={onChangeDescription}
              placeholderTextColor={theme.colors.gray300}
              showCharacterCount
              maxNoOfCharacters={FEED_POST_DESCRIPTION_MAX_CHARACTERS}
              initialValue={description}
              mentions={mentions}
              isEdit={isEdit}
              scrollEnabled={false}
            />
            {selectedLocation?.label && (
              <View style={styles.locationCard}>
                <PostLocationCard
                  location={selectedLocation.label}
                  editLocation={showLocationModal}
                  removeLocation={() => onChangeSelectedLocation(null)}
                />
              </View>
            )}

            {!!images && !!images.length && (
              <View style={styles.imageContainer}>
                <HoliButton
                  type="secondary"
                  variant="small"
                  label={t('global.edit')}
                  inline
                  style={styles.editImages}
                  onPress={showEditImagesModal}
                >
                  <HoliText>{t('global.edit')}</HoliText>
                  <HoliIcon size={16} icon={Edit2} style={styles.buttonIcon} />
                </HoliButton>
                <HoliCarousel
                  marginHorizontal={Spacing.sm}
                  style={styles.imageCarousel}
                  slides={images.map((image: any, index) => ({
                    children: <ImagePreview key={index} image={image} />,
                  }))}
                />
              </View>
            )}
          </View>
        </ScrollView>

        <SubmitPostBar
          onSubmit={submit}
          onSetImage={onChangeImage}
          showLocationModal={showLocationModal}
          showEditImagesModal={showEditImagesModal}
          hasSetImage={!!image}
          submitting={submitting}
          isSubmittable={isSubmittable}
          isEdit={isEdit}
          images={images}
          setImages={onChangeImages}
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
      <HoliModal
        label={t('individuals.post.input.topics.title')}
        autoHeight={true}
        show={visibleTopicsModal}
        onDismiss={hideTopicsModal}
        testID="post-selectedTopics-input"
      >
        <HoliModalContentWrapper
          actionButtonText={t('global.save')}
          onActionButtonPress={hideTopicsModal}
          headlineText={t('individuals.post.input.topics.title')}
          testID="post-selectedTopics-input-content"
        >
          <PostTopics onChangeSelectedTopics={onChangeSelectedTopics} selectedTopicsIds={selectedTopics || []} />
        </HoliModalContentWrapper>
      </HoliModal>
      <HoliModal
        label={t('individuals.post.input.topics.title')}
        show={visibleLocationModal}
        onDismiss={hideLocationModal}
        testID="post-location-input"
        style={styles.modal}
      >
        <FormWrapper
          headlineText={t('individuals.post.input.topics.title')}
          isModal
          onSave={onSaveLocation}
          keyboardShouldPersistTaps="handled"
          showCancelButton
          onCancel={hideLocationModal}
          showBottomBar
          saveButtonDisabled={!selectedLocation}
          style={styles.modal}
          renderProp={() => (
            <>
              <View style={styles.locationContainer}>
                <HoliHeading level="1" size="m">
                  {t('individuals.post.input.location.title')}
                </HoliHeading>
                <HoliText color="gray300" size="small">
                  {t('individuals.post.input.location.description')}
                </HoliText>
              </View>
              <PlacesAutocomplete
                label={t('individuals.post.input.location')}
                placeholder={t('spaces.input.location.placeholder')}
                selected={selectedLocation}
                id="post-location-input"
                testID="post-location-input"
                onChange={handleLocationChange}
                style={[styles.input, { zIndex: 2 }]}
                inputProps={{ autoFocus: true, clearButtonMode: 'always' }}
                suggestionsStyle={styles.suggestionsContainer}
                enhanceWithDetails
              />
            </>
          )}
        />
      </HoliModal>

      <HoliModal
        label={t('individuals.post.input.topics.title')}
        show={visibleEditImagesModal}
        onDismiss={hideEditImagesModal}
        style={{ backgroundColor: theme.colors.background20 }}
        testID="post-location-input"
      >
        <EditUploadedImages images={images} setImages={onChangeImages} onActionButtonPress={hideEditImagesModal} />
      </HoliModal>
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
    imageContainer: {
      paddingTop: Spacing.sm,
      alignItems: 'flex-end',
    },
    editImages: {
      borderRadius: 28,
      marginRight: Spacing['3xs'],
    },
    buttonIcon: {
      marginLeft: Spacing['4xs'],
    },
    imageCarousel: {
      marginHorizontal: -Spacing['3xs'],
      marginTop: Spacing['3xs'],
      flex: 1,
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
      borderTopColor: theme.dark ? theme.colors.brandColorB30 : theme.colors.background30,
      borderRightColor: theme.dark ? theme.colors.brandColorB30 : theme.colors.background30,
      borderLeftColor: theme.dark ? theme.colors.brandColorB30 : theme.colors.background30,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderRadius: 12,
      elevation: 4,
      borderTopWidth: 1,
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
    input: {
      marginBottom: 16,
    },
    suggestionsContainer: {
      backgroundColor: theme.colors.background10,
    },

    locationContainer: {
      width: '100%',
      gap: 8,
      paddingBottom: 24,
    },
    modal: {
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        web: {
          height: '50%',
        },
      }),
    },
    locationCard: {
      padding: 8,
      paddingTop: 24,
    },
  })

export default withProfiler(PostInputForm, { name: 'PostInputForm' })
