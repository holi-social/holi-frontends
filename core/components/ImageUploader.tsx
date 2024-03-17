import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Image as ReactNativeImage } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { AvatarSize, sizes } from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

export interface ImageUploaderProps {
  style?: StyleProp<ViewStyle>
  imageLabel?: string
  instructions?: string
  onUploadImage: (image: HoliImageInfo | null) => void
  image: HoliImageInfo | undefined | null
  currentImageUri?: string
  previewVariant?: string
  placeholder?: React.ReactNode
  uploadImageProps?: {
    buttonLabel?: string
    testID?: string
  }
  changeImageProps?: {
    buttonLabel?: string
    testID?: string
  }
  removeImageProps?: {
    buttonLabel?: string
    testID?: string
  }
  limitBytes?: number
  resizeWidth?: number
}

const ImageUploader = ({
  style,
  imageLabel,
  instructions,
  onUploadImage,
  image,
  currentImageUri,
  previewVariant = 'default',
  placeholder,
  uploadImageProps,
  changeImageProps,
  removeImageProps,
  limitBytes,
  resizeWidth,
}: ImageUploaderProps) => {
  const { t } = useTranslation()
  const { width: deviceWidth } = useClientWindowDimensions()
  const styles = createStyles(getAvatarSize(deviceWidth).width)

  const [imageUri, setImageUri] = useState<string | undefined>()

  useEffect(() => {
    setImageUri(currentImageUri)
  }, [currentImageUri])

  const removeImage = () => {
    onUploadImage(null)
    setImageUri(undefined)
  }

  return (
    <View style={[styles.imageUploader, style]}>
      {((image || imageUri) && (
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            {/* TODO: replace with HoliImage component. Image preview currently only working with ReactNativeImage */}
            <ReactNativeImage
              source={{ uri: image ? image.uri : imageUri }}
              resizeMode="cover"
              aria-label={imageLabel}
              style={
                previewVariant === 'avatar'
                  ? [styles.avatarBase, styles.avatarUser]
                  : previewVariant === 'space'
                  ? [styles.avatarBase, styles.avatarSpace]
                  : {
                      aspectRatio: 1.5,
                      borderRadius: 8,
                      width: '100%',
                    }
              }
            />
          </View>
          <View style={styles.uploadButtonContainer}>
            <HoliImagePicker
              fileSizeLimitation={{
                type: 'resize',
                limitBytes: limitBytes ?? IMAGE_MAX_FILE_SIZE_BYTES,
                resizeWidth: resizeWidth ?? CONTENT_IMAGE_MAX_WIDTH,
              }}
              buttonProps={{
                variant: 'medium',
                label: changeImageProps?.buttonLabel ?? t('global.image.change.label'),
                testID: changeImageProps?.testID,
                style: styles.imageUploadButton,
                type: 'secondary',
                inline: true,
              }}
              onPickImage={onUploadImage}
            >
              <HoliText numberOfLines={1}>{changeImageProps?.buttonLabel ?? t('global.image.change.label')}</HoliText>
            </HoliImagePicker>

            <HoliButton
              type="secondary"
              variant="medium"
              label={removeImageProps?.buttonLabel ?? t('global.image.remove.label')}
              onPress={removeImage}
              testID={removeImageProps?.testID}
              style={styles.imageUploadButton}
              inline
            >
              <HoliText numberOfLines={1}>{removeImageProps?.buttonLabel ?? t('global.image.remove.label')}</HoliText>
            </HoliButton>
          </View>
        </View>
      )) || (
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>{placeholder}</View>
          <View style={styles.uploadButtonContainer}>
            <HoliImagePicker
              fileSizeLimitation={{
                type: 'resize',
                limitBytes: limitBytes ?? IMAGE_MAX_FILE_SIZE_BYTES,
                resizeWidth: resizeWidth ?? CONTENT_IMAGE_MAX_WIDTH,
              }}
              buttonProps={{
                variant: 'medium',
                label: uploadImageProps?.buttonLabel ?? t('global.image.upload.label'),
                testID: uploadImageProps?.testID,
                style: styles.imageUploadButton,
                type: 'secondary',
                inline: true,
              }}
              onPickImage={onUploadImage}
            >
              <HoliText numberOfLines={1}>{uploadImageProps?.buttonLabel ?? t('global.image.upload.label')}</HoliText>
            </HoliImagePicker>
          </View>
        </View>
      )}
      <View style={styles.instructionsContainer}>
        <HoliText size="extrasmall" style={styles.instructions}>
          {instructions ? instructions : t('global.upload.hint')}
        </HoliText>
      </View>
    </View>
  )
}

export default ImageUploader

export const getAvatarSize = (deviceWidth: number) => {
  const avatarSize: AvatarSize = deviceWidth > dimensions.breakpointL ? 'extralarge' : 'large'
  return { size: avatarSize, width: sizes[avatarSize] }
}

const createStyles = (width: number) =>
  StyleSheet.create({
    imageUploader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
      ...Platform.select({
        web: {
          paddingVertical: 24,
        },
      }),
    },
    contentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      gap: 8,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    imageUploadButton: {
      // todo: remove padding style after rebranding of HoliButton
      paddingHorizontal: 16,
    },
    avatarBase: {
      aspectRatio: 1,
      width: width,
      borderColor: colors.foreground30,
      borderWidth: 2,
    },
    avatarUser: {
      borderRadius: width / 2,
    },
    avatarSpace: {
      borderRadius: 8,
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
  })
