import { getInfoAsync } from 'expo-file-system'
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator'
import {
  ImagePickerAsset,
  ImagePickerResult,
  PermissionStatus,
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
} from 'expo-image-picker'
import { MediaTypeOptions } from 'expo-image-picker'
import { useCallback } from 'react'

import { HoliImagePickerFileSizeLimitation } from '@holi/ui/components/organisms/HoliImagePicker/types'

const resizeImage = async (asset: ImagePickerAsset, resizeWidth: number): Promise<ImagePickerResult> => {
  const resizeActions = [{ resize: { width: resizeWidth } }]
  const resizeSaveOptions = {
    compress: 0.8,
    format: SaveFormat.JPEG,
    base64: false,
  }
  const resizedImage = await manipulateAsync(asset.uri, resizeActions, resizeSaveOptions)
  const resizedAsset = {
    ...asset,
    uri: resizedImage.uri,
    width: resizedImage.width,
    height: resizedImage.height,
  } as ImagePickerAsset

  return {
    canceled: false,
    assets: [resizedAsset],
  } as ImagePickerResult
}

export type HoliImagePickerResult = 'missingPermissions' | 'technicalError' | 'invalidFileSize' | ImagePickerResult

export const useMediaLibraryImagePicker = (allowsMultipleSelection = false) => {
  const [mediaLibraryPermissionInfo, requestMediaLibraryPermission] = useMediaLibraryPermissions()

  const verifyPermissions = useCallback(async () => {
    if (!mediaLibraryPermissionInfo) return false

    if (mediaLibraryPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestMediaLibraryPermission()
      return permissionResponse.granted
    }

    if (mediaLibraryPermissionInfo.status === PermissionStatus.DENIED) {
      return false
    }

    return true
  }, [mediaLibraryPermissionInfo, requestMediaLibraryPermission])

  const pickImages = useCallback(
    async (fileSizeLimitation: HoliImagePickerFileSizeLimitation) => {
      const hasPermission = await verifyPermissions()
      if (!hasPermission) return 'missingPermissions'

      let imagePickerResult
      try {
        imagePickerResult = await launchImageLibraryAsync({
          mediaTypes: MediaTypeOptions.Images,
          allowsEditing: !allowsMultipleSelection,
          quality: 1,
          base64: true,
          allowsMultipleSelection,
          aspect: [16, 9],
        })
      } catch (error) {
        // using an older phone and a larger image, picking an image can lead to out-of-memory errors and
        // therefore a refused promise (observed on older Android device with ~ 20MB image size)
        return 'technicalError'
      }

      if (imagePickerResult.canceled) {
        return imagePickerResult
      }

      // selection of multiple files is not supported, therefore we can safely assume that the first file
      // is the one (and only one) we want to check
      const asset = imagePickerResult.assets[0]
      const fileInfo = await getInfoAsync(asset.uri)

      switch (fileSizeLimitation.type) {
        case 'unlimited':
          return imagePickerResult
        case 'resize':
          if ('size' in fileInfo && fileInfo.size > fileSizeLimitation.limitBytes) {
            return await resizeImage(asset, fileSizeLimitation.resizeWidth)
          } else {
            return imagePickerResult
          }
        case 'reject':
          if ('size' in fileInfo && fileInfo.size > fileSizeLimitation.limitBytes) {
            return 'invalidFileSize'
          } else {
            return imagePickerResult
          }
      }
    },
    [verifyPermissions, allowsMultipleSelection]
  )

  return {
    pickImages,
  }
}
