import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, ViewStyle } from 'react-native'
import { Image as ReactNativeImage } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type SpaceImageFormProps = {
  title?: string
  description?: string
  instructions?: string
  onUploadImage: (image: HoliImageInfo) => void
  image?: HoliImageInfo | null
  blurhash?: string
  currentImageUri?: string
  style?: ViewStyle
  previewVariant?: string
}

const IMAGE_ASPECT_RATIO = 3 / 2

const SpaceImageForm: React.FC<SpaceImageFormProps> = ({
  title,
  description,
  instructions,
  onUploadImage,
  image,
  currentImageUri,
  style,
  previewVariant = 'default',
}: SpaceImageFormProps) => {
  const { t } = useTranslation()
  const [uri, setImageUri] = useState<string | undefined>()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  useEffect(() => {
    setImageUri(currentImageUri)
  }, [currentImageUri])

  const Uploader = () => {
    return (
      <View style={styles.imageUploader}>
        {((image || uri) && (
          <>
            <View style={styles.imageContainer}>
              {/* TODO: replace with HoliImage component. Image preview currently only working with ReactNativeImage */}
              <ReactNativeImage
                source={{ uri: image ? image.uri : uri }}
                resizeMode="cover"
                aria-label={t('spaces.input.coverImage.label')}
                style={{
                  aspectRatio: IMAGE_ASPECT_RATIO,
                  borderRadius: 8,
                  width: previewVariant === 'avatar' ? '30%' : '100%',
                }}
              />
            </View>
            <View style={styles.uploadButtonContainer}>
              <HoliImagePicker
                fileSizeLimitation={{
                  type: 'resize',
                  limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
                  resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
                }}
                buttonProps={{
                  label: t('spaces.input.coverImage.change.button.label'),
                  testID: 'space-upload-image-btn',
                  style: styles.imageUploadButton,
                  inline: true,
                }}
                onPickImage={onUploadImage}
              >
                <HoliText numberOfLines={1}>{t('spaces.input.coverImage.change.button.label')}</HoliText>
              </HoliImagePicker>
            </View>
          </>
        )) || (
          <View style={styles.uploadButtonContainer}>
            <HoliImagePicker
              fileSizeLimitation={{
                type: 'resize',
                limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
                resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
              }}
              buttonProps={{
                label: t('spaces.input.coverImage.upload.button.label'),
                testID: 'space-upload-image-btn',
                style: styles.imageUploadButton,
              }}
              onPickImage={onUploadImage}
            >
              <HoliText numberOfLines={1}>{t('spaces.input.coverImage.upload.button.label')}</HoliText>
            </HoliImagePicker>
          </View>
        )}
        <Instructions />
      </View>
    )
  }

  const Instructions = () => {
    return (
      <View style={styles.instructionsContainer}>
        <HoliText size="extrasmall" style={styles.instructions}>
          {instructions ? instructions : t('spaces.input.coverImage.upload.hint')}
        </HoliText>
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      {!!title && (
        <HoliText size="extralarge" style={styles.title}>
          {title}
        </HoliText>
      )}
      {!!description && <HoliText style={styles.subTitle}>{description}</HoliText>}
      <View style={styles.holiTabs}>
        <HoliTabs
          testID="upload-image-tabs"
          data={[
            {
              key: 'upload',
              tabTitle: t('spaces.input.coverImage.tab.upload.title'),
              content: () => <Uploader />,
            },
          ]}
          keyExtractor={({ key }) => key}
          renderTabContent={({ item }) => item.content()}
          activeTab="upload"
          onChange={() => {
            null
          }}
          backgroundColor={theme.colors.background10}
        />
      </View>
    </View>
  )
}

export default SpaceImageForm

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingTop: 24,
      paddingBottom: 42,
    },
    title: {
      marginBottom: 16,
    },
    subTitle: {
      color: theme.colors.foreground20,
    },
    imageUploadButton: {
      backgroundColor: theme.colors.background10,
      minHeight: 48,
    },
    instructionsContainer: {
      marginTop: 8,
      justifyContent: 'center',
    },
    instructions: {
      justifyContent: 'center',
      textAlign: 'center',
      color: theme.colors.foreground20,
    },
    holiTabs: {
      marginTop: 32,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      overflow: 'hidden',
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      width: '100%',
    },
    imageUploader: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      ...Platform.select({
        web: {
          paddingVertical: 42,
        },
      }),
    },
    uploadButtonContainer: {
      flex: 1,
      ...Platform.select({
        web: {
          flexDirection: 'row',
        },
      }),
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      minHeight: 48,
      flexWrap: 'wrap',
    },
  })
