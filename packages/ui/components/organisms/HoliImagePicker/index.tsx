import { ReactNativeFile } from 'apollo-upload-client'
import { MediaTypeOptions } from 'expo-image-picker'
import React, { useCallback } from 'react'

import HoliButton from '@holi/ui/components/molecules/HoliButton'

import { HoliImagePickerProps } from './types'
import { useMediaLibraryImagePicker } from './useMediaLibraryImagePicker'

const HoliImagePicker: React.FC<HoliImagePickerProps> = ({ children, buttonProps, onPickImage }) => {
  const { pickImage } = useMediaLibraryImagePicker()

  const pickImageHandler = useCallback(async () => {
    const image = await pickImage({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    })

    if (!image || image.cancelled) return

    const { uri, base64 = '', height, width } = image
    const response = await fetch(uri)
    const blob = await response.blob()
    const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const reactNativeFile = new ReactNativeFile({
      uri,
      name: filename,
      type: blob.type,
    })

    onPickImage({ uri, blob: reactNativeFile, base64, height, width })
  }, [pickImage, onPickImage])

  return (
    <HoliButton {...buttonProps} onPress={pickImageHandler}>
      {children}
    </HoliButton>
  )
}

export default HoliImagePicker

export type { HoliImagePickerProps }
