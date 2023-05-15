import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceImageFormProps = {
  title?: string
  description?: string
  instructions?: string
  onUploadImage: (image: ImageInfo | undefined) => void
  image: ImageInfo | undefined
  currentImageUri?: string
  style?: ViewStyle
  previewVariant?: string
}

const SpaceImageForm: React.VFC<SpaceImageFormProps> = ({
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
  const [uri, setImageUri] = useState<string | undefined>(currentImageUri)

  const removeImage = () => {
    onUploadImage(undefined)
    setImageUri(undefined)
  }

  const Uploader = () => {
    return (
      <View style={styles.imageUploader}>
        {((image || uri) && (
          <>
            <View style={styles.imageContainer}>
              <HoliImage
                source={{ uri: image ? image.uri : uri }}
                label={t('spaces.input.coverImage.label')}
                style={{
                  aspectRatio: 1.5,
                  borderRadius: 8,
                  width: previewVariant === 'avatar' ? '30%' : '100%',
                }}
              />
            </View>
            <View style={styles.uploadButtonContainer}>
              <HoliImagePicker
                maxFileSizeInMB={8}
                buttonProps={{
                  label: t('spaces.input.coverImage.change.button.label'),
                  testID: 'space-upload-image-btn',
                  style: styles.imageUploadButton,
                }}
                onPickImage={onUploadImage}
              >
                <HoliText numberOfLines={1}>{t('spaces.input.coverImage.change.button.label')}</HoliText>
              </HoliImagePicker>

              <HoliButton
                label={t('spaces.input.coverImage.remove.button.label')}
                onPress={removeImage}
                testID="create-space-remove-image-btn"
                style={styles.imageUploadButton}
              >
                <HoliText numberOfLines={1}>{t('spaces.input.coverImage.remove.button.label')}</HoliText>
              </HoliButton>
            </View>
          </>
        )) || (
          <View style={styles.uploadButtonContainer}>
            <HoliImagePicker
              maxFileSizeInMB={8}
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
      <HoliTabs
        id="upload-image-tabs"
        style={styles.holiTabs}
        tabBarStyle={styles.tabBar}
        tabs={[
          {
            title: t('spaces.input.coverImage.tab.upload.title'),
            style: styles.tabStyle,
            children: <Uploader />,
          },
        ]}
      />
    </View>
  )
}

export default SpaceImageForm

const styles = StyleSheet.create({
  container: {
    paddingBottom: 42,
  },
  title: {
    marginTop: 40,
  },
  subTitle: {
    marginTop: 16,
    color: colors.foreground20,
  },
  imageUploadButton: {
    backgroundColor: colors.background10,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    marginTop: 8,
    justifyContent: 'center',
  },
  instructions: {
    justifyContent: 'center',
    textAlign: 'center',
    color: colors.foreground20,
  },
  holiTabs: {
    marginTop: 32,
    backgroundColor: colors.background20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  imageUploadContainer: {
    marginBottom: 4,
    marginHorizontal: 2,
    paddingTop: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingBottom: 0,
  },
  tabStyle: {
    width: '100%',
    backgroundColor: colors.background10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 8,
  },
  tabBar: {
    paddingLeft: 24,
  },
})
