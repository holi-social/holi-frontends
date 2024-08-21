import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FlatList, Image, ScrollView, StyleSheet, View } from 'react-native'
import ImageCropPicker from 'react-native-image-crop-picker'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ImageAdd, ImageEdit } from '@holi/icons/src/generated'
import { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

import ImagePreview from './ImagePreview'

const ImageUpload = ({
  onSetImages,
  images,
  buttonProps = { transparent: true, inline: true, label: '' },
  children,
}: {
  onSetImages: (images: HoliImageInfo[]) => void
  images: HoliImageInfo[]
  buttonProps?: Omit<HoliButtonProps, 'children' | 'onPress'>
  children?: React.ReactNode
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
      buttonProps={buttonProps}
      onPickImages={onSetImages}
    >
      {children}
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
