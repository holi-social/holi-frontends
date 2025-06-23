import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image as ReactNativeImage, StyleSheet, View } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import type { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LinkM } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect from '@holi/ui/components/organisms/HoliModalSelect'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { CollectionType } from '@holi/api/graphql/graphql-codegen'

export const COLLECTION_TYPES = Object.values(CollectionType)

export interface DigitalToolInputFormProps {
  onChangeUrl: (url: string) => void
  onChangeTitle: (title: string) => void
  onChangeDescription: (description: string) => void
  onSelectCollectionType: (option: CollectionType) => void
  onChangeThumbnail: (thumbnail: HoliImageInfo) => void
  url: string
  title: string
  description?: string
  selectedCollectionType?: CollectionType
  thumbnail?: HoliImageInfo | undefined
  thumbnailBlurhash?: string
  fieldErrors?: TranslatedFieldErrors
  currentThumbnail?: string
}

const DigitalToolInputForm: React.FC<DigitalToolInputFormProps> = ({
  onChangeUrl,
  onChangeTitle,
  onChangeDescription,
  onSelectCollectionType,
  onChangeThumbnail,
  url,
  title,
  description,
  selectedCollectionType,
  thumbnail,
  fieldErrors = {},
  currentThumbnail,
}: DigitalToolInputFormProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const [urlError, setUrlError] = useState<string | undefined>()
  const [titleError, setTitleError] = useState<string | undefined>()
  const [descriptionError, setDescriptionError] = useState<string | undefined>()

  const { show, hide, visible } = useModalState()

  const collectionTypeOptions = useMemo(
    () =>
      COLLECTION_TYPES.map((cType) => {
        return {
          id: cType,
          title: t(`spaces.toolKit.linkhub.collection.${cType}`),
        }
      }),
    [t]
  )

  useEffect(() => {
    setUrlError(fieldErrors?.url?.[0])
    setDescriptionError(fieldErrors?.description?.[0])
    setTitleError(fieldErrors?.title?.[0])
  }, [fieldErrors])

  const thumbnailUri = thumbnail?.uri ?? currentThumbnail

  return (
    <>
      <HoliTextInput
        placeholder={t('spaces.input.digitalTool.url.placeholder')}
        inputLabel={t('spaces.input.digitalTool.url.label')}
        validationErrorText={urlError}
        value={url}
        onChange={onChangeUrl}
        aria-label={t('spaces.input.digitalTool.url.label')}
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
        aria-label={t('spaces.input.digitalTool.title.label')}
        testID="tool-title"
        style={{ marginTop: 16 }}
        isRequired={true}
        maxNoOfCharacters={50}
      />
      <HoliModalSelect
        selected={selectedCollectionType}
        options={collectionTypeOptions}
        title={t('spaces.input.digitalTool.collection.label')}
        label={t('spaces.input.digitalTool.collection.label')}
        placeholder={t('spaces.input.digitalTool.collection.placeholder')}
        style={styles.collectionOption}
        onChange={({ id }) => onSelectCollectionType(id)}
        isRequired={true}
        variant="dense"
        show={show}
        hide={hide}
        visible={visible}
        testID="digital-tool-collection"
      />
      <HoliTextInput
        placeholder={t('spaces.input.digitalTool.description.placeholder')}
        inputLabel={t('spaces.input.digitalTool.description.label')}
        validationErrorText={descriptionError}
        value={description}
        onChange={onChangeDescription}
        aria-label={t('spaces.input.digitalTool.description.label')}
        testID="tool-description"
        style={{ marginTop: 16 }}
        maxNoOfCharacters={100}
      />
      <HoliText style={styles.thumbnailTitle}>{t('spaces.input.digitalTool.thumbnail.label')}</HoliText>

      {/* ThumbnailUploader */}
      <View style={styles.thumbnailContainer}>
        {/*// TODO: replace with HoliImage component. Image preview currently only working with ReactNativeImage */}
        {thumbnailUri ? (
          <ReactNativeImage
            source={{ uri: thumbnailUri }}
            resizeMode="cover"
            aria-label={t('spaces.input.coverImage.label')}
            style={styles.thumbnail}
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailSkeliton]}>
            <HoliIcon icon={LinkM} size={20} colorOverride={colors.brandColorB30} />
          </View>
        )}
        <View style={styles.uploadButtonContainer}>
          <HoliImagePicker
            fileSizeLimitation={{
              type: 'resize',
              limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
              resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
            }}
            buttonProps={{
              label: t('spaces.input.digitalTool.upload.button.label'),
              style: styles.imageUploadButton,
              testID: 'space-upload-image-btn',
            }}
            onPickImage={onChangeThumbnail}
          />
        </View>
        <View style={styles.instructionsContainer}>
          <HoliText size="extrasmall" style={styles.instructions}>
            {t('spaces.input.coverImage.upload.hint')}
          </HoliText>
        </View>
      </View>
    </>
  )
}

export default DigitalToolInputForm

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    collectionOption: {
      marginTop: 16,
    },
    thumbnailTitle: {
      marginTop: 56,
    },
    thumbnailContainer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: theme.colors.background10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    thumbnail: {
      aspectRatio: 1,
      width: '20%',
      borderRadius: 8,
      marginBottom: 16,
    },
    thumbnailSkeliton: {
      backgroundColor: theme.colors.brandColorB10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageUploadButton: {
      backgroundColor: theme.colors.background10,
      borderWidth: 1,
    },
    instructionsContainer: {
      marginTop: 16,
      justifyContent: 'center',
    },
    instructions: {
      justifyContent: 'center',
      textAlign: 'center',
      color: theme.colors.foreground20,
    },
  })
