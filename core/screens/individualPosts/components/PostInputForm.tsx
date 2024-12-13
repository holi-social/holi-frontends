import { withProfiler } from '@sentry/react'
import { ChipAction } from 'holi-bricks/components/chips'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import FormLayout from '@holi/core/components/FormLayout/FormLayout'
import type { Term, User } from '@holi/core/domain/shared/types'
import type { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { type GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { CategorySelectionModal } from '@holi/core/screens/individualPosts/components/CategorySelectionModal'
import EditUploadedImages from '@holi/core/screens/individualPosts/components/EditUploadedImages'
import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import PostLocationCard from '@holi/core/screens/individualPosts/components/PostLocationCard'
import PostTopics from '@holi/core/screens/individualPosts/components/PostTopics'
import { SubmitPostBar } from '@holi/core/screens/individualPosts/components/SubmitPostBar'
import {
  FEED_POST_DESCRIPTION_MAX_CHARACTERS,
  FEED_POST_TITLE_MAX_CHARACTERS,
  FeedPostSchema,
} from '@holi/core/screens/individualPosts/mutations'
import { type FeedPostImage, ImageAspectRatio } from '@holi/core/screens/individualPosts/types'
import type { FeedPostCategories } from '@holi/core/screens/individualPosts/useFeedPostCategories'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Edit2, Global, HoliLogoFilled, Pencil } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { type HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  images: HoliImageInfo[]
  currentImages?: FeedPostImage[]
  selectedVisibility: Visibility
  selectedCategoryId: string | null
  selectedTopics?: Term[]
  selectedLocation?: GeolocationSuggestion
  onChangeTitle: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeSelectedVisibility: (_: Visibility) => void
  onChangeImages: (_: HoliImageInfo[]) => void
  onChangeCurrentImages?: (images: FeedPostImage[]) => void
  onChangeSelectedTopics: (_: Term[]) => void
  onChangeSelectedCategoryId: (_: string) => void
  onChangeSelectedLocation: (_: GeolocationSuggestion | null) => void
  aspectRatio: ImageAspectRatio
  onChangeAspectRatio: (_: ImageAspectRatio) => void
  onSubmit: () => void
  isEdit?: boolean
  fieldErrors?: TranslatedFieldErrors
  submitting: boolean
  categories: FeedPostCategories | null
  mentions?: User[]
  selectCategory: (categoryId: string) => void
}

const PostInputForm: React.FC<PostInputFormProps> = ({
  title,
  description,
  images,
  currentImages,
  mentions = [],
  selectedVisibility,
  selectedCategoryId,
  selectedLocation,
  selectedTopics,
  onChangeTitle,
  onChangeDescription,
  onChangeSelectedVisibility,
  onChangeImages,
  onChangeCurrentImages,
  aspectRatio,
  onChangeAspectRatio,
  onChangeSelectedTopics,
  onChangeSelectedLocation,
  onSubmit,
  isEdit = false,
  submitting,
  categories,
  selectCategory,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const styles = useMemo(() => getStyles(theme), [theme])

  const [isSubmittable, setIsSubmittable] = useState<boolean>(false)

  const { show: showVisibility, hide: hideVisibility, visible: visibleVisibility } = useModalState()
  const { show: showTopicsModal, hide: hideTopicsModal, visible: visibleTopicsModal } = useModalState()
  const { show: showLocationModal, hide: hideLocationModal, visible: visibleLocationModal } = useModalState()
  const { show: showEditImagesModal, hide: hideEditImagesModal, visible: visibleEditImagesModal } = useModalState()
  const { show: showCategoryModal, hide: hideCategoryModal, visible: visibleCategoryModal } = useModalState()

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

  const handleChangeVisibility = (option: HoliModalSelectOption<Visibility>) => onChangeSelectedVisibility(option.id)

  const categoryLabel = categories?.find((category) => category.id === selectedCategoryId)?.label ?? selectedCategoryId

  const descriptionPlaceholder =
    categories?.find((category) => category.id === selectedCategoryId)?.description ??
    t('individuals.post.input.category.input.description')

  const handleLocationChange = (selected?: GeolocationSuggestion) => {
    selected ? onChangeSelectedLocation(selected) : onChangeSelectedLocation(null)
    if (selected) {
      hideLocationModal()
    }
  }

  return (
    <>
      <FormLayout
        hasSuggestions
        bottomBar={
          <SubmitPostBar
            onSubmit={onSubmit}
            showLocationModal={showLocationModal}
            showEditImagesModal={showEditImagesModal}
            submitting={submitting}
            isSubmittable={isSubmittable}
            isEdit={isEdit}
            images={images}
            currentImages={currentImages}
            setImages={onChangeImages}
          />
        }
      >
        <>
          <View style={styles.pillContainer}>
            <ChipAction id="post-visibility-pill" onPress={showVisibility} iconTrailing={Pencil} color="white">
              {t(`individuals.post.category.label.visibility.${selectedVisibility}`)}
            </ChipAction>
            <ChipAction id="post-category-pill" onPress={showCategoryModal} iconTrailing={Pencil} color="yellow">
              {categoryLabel ? categoryLabel : t('individuals.post.category.label.category')}
            </ChipAction>

            {selectedTopics &&
              (selectedTopics?.length < 1 ? (
                <ChipAction id="post-topic-pill" onPress={showTopicsModal} iconTrailing={Add} color="green">
                  {t('individuals.post.category.label.topic')}
                </ChipAction>
              ) : (
                <ChipAction id="post-topic-pill-selected" onPress={showTopicsModal} color="green">
                  {`${selectedTopics.length} ${t('individuals.post.category.label.topic', {
                    count: selectedTopics.length,
                  })}`}
                </ChipAction>
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

            {((!!images && images.length > 0) || (currentImages && currentImages.length > 0)) && (
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
                {Platform.OS !== 'web' && (
                  <HoliCarousel
                    marginHorizontal={Spacing.sm}
                    style={styles.imageCarousel}
                    slides={[...(currentImages || []), ...images].map((image, index) => {
                      // differentiate types between FeedPostImage and HoliImageInfo
                      const imageInfo = (image as FeedPostImage)?.id ? undefined : (image as HoliImageInfo)
                      const feedPostImage = imageInfo ? undefined : (image as FeedPostImage)
                      return {
                        children: (
                          <ImagePreview
                            key={index}
                            image={imageInfo}
                            currentImage={feedPostImage?.image}
                            aspectRatio={aspectRatio === ImageAspectRatio.SIXTEEN_NINE ? 16 / 9 : 1}
                          />
                        ),
                      }
                    })}
                  />
                )}

                {Platform.OS === 'web' && (
                  <View
                    style={[
                      styles.imageGrid,
                      [...(currentImages || []), ...images].length < 2 ? { justifyContent: 'flex-end' } : {},
                    ]}
                  >
                    {[...(currentImages || []), ...images].map((image, index) => {
                      // differentiate types between FeedPostImage and HoliImageInfo
                      const imageInfo = (image as FeedPostImage)?.id ? undefined : (image as HoliImageInfo)
                      const feedPostImage = imageInfo ? undefined : (image as FeedPostImage)
                      return (
                        <View key={index} style={styles.imageGridItemWrapper}>
                          <View style={styles.imageGridItem}>
                            <ImagePreview
                              key={index}
                              image={imageInfo}
                              currentImage={feedPostImage?.image}
                              aspectRatio={aspectRatio === ImageAspectRatio.SIXTEEN_NINE ? 16 / 9 : 1}
                            />
                          </View>
                        </View>
                      )
                    })}
                  </View>
                )}
              </View>
            )}
          </View>
        </>
      </FormLayout>

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
        shown={visibleTopicsModal}
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
        shown={visibleLocationModal}
        onDismiss={hideLocationModal}
        testID="post-location-input"
        style={styles.modal}
        relativeHeight={1}
      >
        <View style={styles.locationWrapper}>
          <HoliContainer>
            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <HoliHeading level="1" size="m">
                  {t('individuals.post.input.location.title')}
                </HoliHeading>
                <HoliButton
                  type="secondary"
                  inline
                  variant="small"
                  label={t('global.done')}
                  onPress={hideLocationModal}
                >
                  <HoliText>{t('global.done')}</HoliText>
                </HoliButton>
              </View>
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
              suggestionsStyle={styles.placesAutoComplete}
              enhanceWithDetails
            />
          </HoliContainer>
        </View>
      </HoliModal>

      <HoliModal
        label={t('individuals.post.input.topics.title')}
        shown={visibleEditImagesModal}
        onDismiss={hideEditImagesModal}
        style={{ backgroundColor: theme.colors.background20 }}
        testID="post-location-input"
      >
        <EditUploadedImages
          images={images}
          currentImages={currentImages}
          setImages={onChangeImages}
          setCurrentImages={onChangeCurrentImages}
          onActionButtonPress={hideEditImagesModal}
          setAspectRatio={onChangeAspectRatio}
          aspectRatio={aspectRatio}
        />
      </HoliModal>
      <CategorySelectionModal
        visible={visibleCategoryModal}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelection={selectCategory}
        handleModalClose={hideCategoryModal}
      />
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      maxWidth: '100%',
    },
    inputContainer: {
      width: '100%',
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
    imageGrid: {
      width: '100%',
      marginVertical: Spacing.sm,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginHorizontal: -Spacing['4xs'],
    },
    imageGridItemWrapper: {
      width: '50%',
      padding: Spacing['4xs'],
    },
    imageGridItem: {
      padding: Spacing['3xs'],
      borderRadius: Spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      backgroundColor: theme.colors.white100,
    },
    pillContainer: {
      width: '100%',
      flexWrap: 'wrap',
      marginTop: Platform.OS === 'web' ? 3 : Spacing.sm,
      marginBottom: 24,
      flexDirection: 'row',
      zIndex: 1,
      gap: 8,
    },
    input: {
      marginBottom: 16,
    },
    placesAutoComplete: {
      backgroundColor: theme.colors.background10,
    },
    locationContainer: {
      width: '100%',
      gap: 8,
      paddingBottom: 24,
    },
    locationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    locationWrapper: {
      height: '100%',
      paddingTop: Spacing.xs,
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
