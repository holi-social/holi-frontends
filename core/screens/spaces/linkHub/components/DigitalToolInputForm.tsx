import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import { CollaborationType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors } from '@holi/ui/styles/globalVars'

export const COLLECTION_TYPES = Object.keys(CollaborationType) as Array<keyof typeof CollaborationType>
export interface DigitalToolInputFormProps {
  onChangeUrl: (url: string) => void
  onChangeTitle: (title: string) => void
  onChangeDescription: (description: string) => void
  onSelectCollection: (option: HoliModalSelectOption) => void
  onChangeThumbnail: (thumbnail: HoliImageInfo) => void
  url: string
  title: string
  description?: string
  selectedCollection?: HoliModalSelectOption
  thumbnail?: HoliImageInfo | undefined
  fieldErrors?: TranslatedFieldErrors
  currentThumbnail?: string
}

const DigitalToolInputForm: React.VFC<DigitalToolInputFormProps> = ({
  onChangeUrl,
  onChangeTitle,
  onChangeDescription,
  onSelectCollection,
  onChangeThumbnail,
  url,
  title,
  description,
  selectedCollection,
  thumbnail,
  fieldErrors = {},
  currentThumbnail,
}: DigitalToolInputFormProps) => {
  const { t } = useTranslation()
  const collectionTypes = useMemo(
    () =>
      COLLECTION_TYPES.map((collectionType) => {
        return {
          id: collectionType,
          title: t(`spaces.toolKit.linkhub.collection.${collectionType}`),
          selected: false,
        }
      }),
    [t]
  )
  const [collectionOptions, setCollectionOptions] = useState<HoliModalSelectOption[]>(collectionTypes)

  const [urlError, setUrlError] = useState<string | undefined>()
  const [titleError, setTitleError] = useState<string | undefined>()
  const [descriptionError, setDescriptionError] = useState<string | undefined>()

  useEffect(() => {
    setUrlError(fieldErrors?.url?.[0])
    setDescriptionError(fieldErrors?.description?.[0])
    setTitleError(fieldErrors?.title?.[0])
  }, [fieldErrors])

  useEffect(() => {
    if (selectedCollection) {
      const updatedCollectionsList = collectionTypes.map((collectionOption) =>
        collectionOption.id === selectedCollection.id
          ? { ...collectionOption, selected: true }
          : { ...collectionOption, selected: false }
      )
      setCollectionOptions(updatedCollectionsList)
    }
  }, [selectedCollection, collectionTypes])

  const ThumbnailUploader = () => {
    return (
      <View style={styles.thumbnailContainer}>
        {currentThumbnail || thumbnail ? (
          <HoliImage
            source={{ uri: thumbnail?.uri || currentThumbnail }}
            label={t('spaces.input.digitalTool.thumbnail.label')}
            style={styles.thumbnail}
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailSkeliton]}>
            <HoliIcon icon={'link-m'} size={20} style={{ color: colors.brandColorB30 }} />
          </View>
        )}
        <View style={styles.uploadButtonContainer}>
          <HoliImagePicker
            maxFileSizeInMB={8}
            buttonProps={{
              label: t('spaces.input.digitalTool.upload.button.label'),
              style: styles.imageUploadButton,
              testID: 'space-upload-image-btn',
            }}
            onPickImage={onChangeThumbnail}
          >
            <HoliText>{t('spaces.input.digitalTool.upload.button.label')}</HoliText>
          </HoliImagePicker>
        </View>
        <Instructions />
      </View>
    )
  }

  const Instructions = () => {
    return (
      <View style={styles.instructionsContainer}>
        <HoliText size="extrasmall" style={styles.instructions}>
          {t('spaces.input.coverImage.upload.hint')}
        </HoliText>
      </View>
    )
  }

  return (
    <>
      <HoliTextInput
        placeholder={'https://...'}
        inputLabel={t('spaces.input.digitalTool.url.label')}
        validationErrorText={urlError}
        value={url}
        onChange={onChangeUrl}
        accessibilityLabel={t('spaces.input.digitalTool.url.label')}
        testID="tool-url"
        isRequired={true}
        maxNoOfCharacters={500}
      />
      <HoliTextInput
        placeholder={t('spaces.input.digitalTool.title.placeholder')}
        inputLabel={t('spaces.input.digitalTool.title.label')}
        validationErrorText={titleError}
        value={title}
        onChange={onChangeTitle}
        accessibilityLabel={t('spaces.input.digitalTool.title.label')}
        testID="tool-title"
        style={{ marginTop: 16 }}
        isRequired={true}
        maxNoOfCharacters={50}
      />
      <HoliModalSelect
        options={collectionOptions}
        title={t('spaces.input.digitalTool.collection.label')}
        label={t('spaces.input.digitalTool.collection.label')}
        placeholder={t('spaces.input.digitalTool.collection.placeholder')}
        style={styles.collectionOption}
        onChange={onSelectCollection}
        isRequired={true}
        testID="digital-tool-collection"
        variant="dense"
      />
      <HoliTextInput
        placeholder={t('spaces.input.digitalTool.description.placeholder')}
        inputLabel={t('spaces.input.digitalTool.description.label')}
        validationErrorText={descriptionError}
        value={description}
        onChange={onChangeDescription}
        accessibilityLabel={t('spaces.input.digitalTool.description.label')}
        testID="tool-description"
        style={{ marginTop: 16 }}
        maxNoOfCharacters={100}
      />
      <HoliText style={styles.thumbnailTitle}>{t('spaces.input.digitalTool.thumbnail.label')}</HoliText>
      <ThumbnailUploader />
    </>
  )
}

export default DigitalToolInputForm

const styles = StyleSheet.create({
  collectionOption: {
    marginTop: 16,
  },
  thumbnailTitle: {
    marginTop: 56,
  },
  thumbnailContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  thumbnail: {
    aspectRatio: 1,
    width: '20%',
    borderRadius: 8,
    marginBottom: 16,
  },
  thumbnailSkeliton: {
    backgroundColor: colors.brandColorB10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadButton: {
    backgroundColor: colors.background10,
    borderWidth: 1,
  },
  instructionsContainer: {
    marginTop: 16,
    justifyContent: 'center',
  },
  instructions: {
    justifyContent: 'center',
    textAlign: 'center',
    color: colors.foreground20,
  },
})
