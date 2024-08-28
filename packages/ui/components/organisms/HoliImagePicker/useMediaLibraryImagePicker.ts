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
import { Image } from 'react-native'

import { CONTENT_IMAGE_MAX_HEIGHT, CONTENT_IMAGE_MAX_WIDTH } from '@holi/core/constants/constants'
import { HoliImagePickerFileSizeLimitation } from '@holi/ui/components/organisms/HoliImagePicker/types'

const getImageSize = async (imageUri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      imageUri,
      (width, height) => {
        resolve({ width, height })
      },
      (error) => {
        reject(error)
      }
    )
  })
}

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
  } as ImagePickerAsset

  return {
    canceled: false,
    assets: [resizedAsset],
  } as ImagePickerResult
}

export type HoliImagePickerResult = 'missingPermissions' | 'technicalError' | 'invalidFileSize' | ImagePickerResult

export const useMediaLibraryImagePicker = (allowsMultipleSelection = false, maxFiles = 3) => {
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
          quality: 0.5,
          base64: true,
          allowsMultipleSelection,
          aspect: [16, 9],
        })
      } catch (error) {
        return 'technicalError'
      }

      if (imagePickerResult.canceled) {
        return imagePickerResult
      }

      if (imagePickerResult.assets.length > maxFiles) {
        // Limit the selection to the maximum number of files
        imagePickerResult.assets = imagePickerResult.assets.slice(0, maxFiles)
      }

      // Check file sizes for each selected asset
      for (const asset of imagePickerResult.assets) {
        const fileInfo = await getInfoAsync(asset.uri)
        const imageInfo = await getImageSize(asset.uri)
        switch (fileSizeLimitation.type) {
          case 'unlimited':
            continue
          case 'resize':
            if (
              ('size' in fileInfo && fileInfo.size > fileSizeLimitation.limitBytes) ||
              imageInfo?.width > CONTENT_IMAGE_MAX_WIDTH ||
              imageInfo?.height > CONTENT_IMAGE_MAX_HEIGHT
            ) {
              return await resizeImage(
                asset,
                fileSizeLimitation.resizeWidth <= CONTENT_IMAGE_MAX_WIDTH
                  ? fileSizeLimitation.resizeWidth
                  : CONTENT_IMAGE_MAX_WIDTH
              )
            }
            continue
          case 'reject':
            if ('size' in fileInfo && fileInfo.size > fileSizeLimitation.limitBytes) {
              return 'invalidFileSize'
            }
            continue
        }
      }

      return imagePickerResult
    },
    [verifyPermissions, allowsMultipleSelection, maxFiles]
  )

  return {
    pickImages,
  }
}
