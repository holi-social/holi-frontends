import { ImagePickerOptions } from 'expo-image-picker'
import React, { useCallback } from 'react'

import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

import { ImageInfo } from './types'
import { useMediaLibraryImagePicker } from './useMediaLibraryImagePicker'

interface HoliImagePickerProps {
  imagePickerOptions: ImagePickerOptions
  buttonProps: Omit<HoliButtonProps, 'children' | 'onPress'>
  onPickImage: (image: ImageInfo) => void
}

export const HoliImagePicker: React.FC<HoliImagePickerProps> = ({
  children,
  imagePickerOptions,
  buttonProps,
  onPickImage,
}) => {
  const pickImage = useMediaLibraryImagePicker()

  const pickImageHandler = useCallback(async () => {
    const image = await pickImage(imagePickerOptions)

    if (!image || image.cancelled) return

    const { uri, base64 = '', height, width } = image
    const response = await fetch(uri)
    const blob = await response.blob()

    onPickImage({ uri, blob, base64, height, width })
  }, [pickImage, imagePickerOptions, onPickImage])

  return (
    <HoliButton {...buttonProps} onPress={pickImageHandler}>
      {children}
    </HoliButton>
  )
}
