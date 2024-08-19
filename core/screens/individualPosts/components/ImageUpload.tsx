import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FlatList, Image, ScrollView, StyleSheet, View } from 'react-native'
import ImageCropPicker from 'react-native-image-crop-picker'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ImageAdd, ImageEdit } from '@holi/icons/src/generated'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

import ImageEditor from './ImageEditor'

const ImageUpload = ({
  onSubmit,
  onSetImage,
  onSetImages,
  hasSetImage,
  submitting,
  isSubmittable,
  isEdit,
  images,
}: {
  onSubmit: () => void
  onSetImage: (image: HoliImageInfo) => void
  onSetImages: (images: HoliImageInfo[]) => void
  hasSetImage: boolean
  submitting: boolean
  isSubmittable: boolean
  isEdit: boolean
  images: HoliImageInfo[]
}) => {
  const { t } = useTranslation()

  return (
    <HoliImagePicker
      allowsMultipleSelection
      fileSizeLimitation={{
        type: 'resize',
        limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
        resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
      }}
      buttonProps={{
        label: t('individuals.post.image.add'),
        transparent: true,
        inline: true,
      }}
      onPickImage={onSetImage}
      onPickImages={onSetImages}
    >
      <HoliIcon icon={images.length > 0 ? ImageEdit : ImageAdd} style={styles.addImageIcon} />
    </HoliImagePicker>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  addImageIcon: {
    paddingLeft: 2,
  },
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageContainer: {
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
})

export default ImageUpload
