import React from 'react'
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
  style?: ViewStyle
}

const SpaceImageForm: React.VFC<SpaceImageFormProps> = ({
  title,
  description,
  instructions,
  onUploadImage,
  image,
  style,
}: SpaceImageFormProps) => {
  const { t } = useTranslation()

  const removeImage = () => {
    onUploadImage(undefined)
  }

  const ImageUploader = () => {
    return (
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
    )
  }

  const Uploader = () => {
    return (
      <View style={styles.imageUploader}>
        {(image && (
          <>
            <View style={styles.imageContainer}>
              <HoliImage
                source={{ uri: image?.uri ?? '' }}
                label={t('spaces.input.coverImage.label')}
                style={styles.spaceImage}
              />
            </View>
            <View style={styles.uploadButtonContainer}>
              <HoliButton
                label={t('spaces.input.coverImage.remove.button.label')}
                onPress={removeImage}
                testID="create-space-remove-image-btn"
                style={styles.imageUploadButton}
              >
                <HoliText>{t('spaces.input.coverImage.remove.button.label')}</HoliText>
              </HoliButton>
            </View>
          </>
        )) || (
          <HoliImagePicker
            maxFileSizeInMB={8}
            buttonProps={{
              label: t('spaces.input.coverImage.upload.button.label'),
              transparent: true,
              inline: true,
            }}
            onPickImage={onUploadImage}
          >
            <View style={styles.uploadButtonContainer}>
              <HoliButton
                label={t('spaces.input.coverImage.upload.button.label')}
                testID="space-upload-image-btn"
                style={styles.imageUploadButton}
              >
                <HoliText>{t('spaces.input.coverImage.upload.button.label')}</HoliText>
              </HoliButton>
            </View>
          </HoliImagePicker>
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
      <ImageUploader />
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  spaceImage: {
    aspectRatio: 1.5,
    width: '100%',
    borderRadius: 8,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    paddingLeft: 24,
  },
})
