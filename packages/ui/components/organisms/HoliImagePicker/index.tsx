import { ReactNativeFile } from 'apollo-upload-client'
import { MediaTypeOptions } from 'expo-image-picker'
import React from 'react'

import HoliButton from '@holi/ui/components/molecules/HoliButton'

import { HoliImagePickerProps } from './types'
import { useMediaLibraryImagePicker } from './useMediaLibraryImagePicker'

const HoliImagePicker = ({
  children,
  buttonProps,
  onPickImage,
  maxFileSizeInMB,
  multiple = false,
}: React.PropsWithChildren<HoliImagePickerProps>) => {
  const { pickImages } = useMediaLibraryImagePicker()

  const pickImageHandler = async () => {
    const images = await pickImages({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
      maxFileSizeInMB,
      allowsMultipleSelection: multiple,
    })

    if (!images || images?.canceled) return

    for (const { uri, base64, height, width } of images.assets) {
      const response = await fetch(uri)
      const blob = await response.blob()
      const filename = uri.substring(uri.lastIndexOf('/') + 1)
      const reactNativeFile = new ReactNativeFile({
        uri,
        name: filename,
        type: blob.type,
      })

      onPickImage({ uri, blob: reactNativeFile, base64, height, width })
    }
  }

  return (
    <HoliButton {...buttonProps} onPress={pickImageHandler}>
      {children}
    </HoliButton>
  )
}

export default HoliImagePicker

export type { HoliImagePickerProps }
