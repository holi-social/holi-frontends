import { ImageInfo, ImagePickerOptions } from 'expo-image-picker'
import React, { useCallback } from 'react'

import { useMediaLibraryImagePicker } from './useMediaLibraryImagePicker'

interface HoliImagePickerProps {
  imagePickerOptions: ImagePickerOptions
  getChildren: (actionHandler: () => Promise<ImageInfo | undefined>) => React.ReactNode
}

export const HoliImagePicker: React.VFC<HoliImagePickerProps> = ({ getChildren, imagePickerOptions }) => {
  const pickImage = useMediaLibraryImagePicker()

  const onPickImage = useCallback(() => pickImage(imagePickerOptions), [pickImage, imagePickerOptions])

  return <>{getChildren(onPickImage)}</>
}
