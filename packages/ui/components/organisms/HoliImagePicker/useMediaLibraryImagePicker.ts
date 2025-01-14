import { getInfoAsync } from 'expo-file-system'
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator'
import {
  type ImagePickerAsset,
  type ImagePickerResult,
  PermissionStatus,
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
} from 'expo-image-picker'
import { MediaTypeOptions } from 'expo-image-picker'
import { useCallback } from 'react'
import { Image } from 'react-native'

import { CONTENT_IMAGE_MAX_HEIGHT, CONTENT_IMAGE_MAX_WIDTH } from '@holi/core/constants/constants'
import type { HoliImagePickerFileSizeLimitation } from '@holi/ui/components/organisms/HoliImagePicker/types'

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

export const useMediaLibraryImagePicker = (allowsMultipleSelection = false, selectionLimit = 3) => {
  const [mediaLibraryPermissionInfo, requestMediaLibraryPermission] = useMediaLibraryPermissions()

  const verifyPermissions = useCallback(async () => {
    if (!mediaLibraryPermissionInfo) return false

    // it is necessary to request even if already denied, because the user might have changed settings while the value of mediaLibraryPermissionInfo is still "denied"
    if (
      mediaLibraryPermissionInfo.status === PermissionStatus.UNDETERMINED ||
      mediaLibraryPermissionInfo.status === PermissionStatus.DENIED
    ) {
      const permissionResponse = await requestMediaLibraryPermission()
      return permissionResponse.granted
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
          quality: 0.2,
          base64: true,
          allowsMultipleSelection,
          selectionLimit,
        })
      } catch (error) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
        return 'technicalError'
      }

      if (imagePickerResult.canceled) {
        return imagePickerResult
      }

      // Check file sizes for each selected asset
      for (let i = 0; i < imagePickerResult.assets.length; i++) {
        let asset = imagePickerResult.assets[i]
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
              const resizedAsset = await resizeImage(
                asset,
                fileSizeLimitation.resizeWidth <= CONTENT_IMAGE_MAX_WIDTH
                  ? fileSizeLimitation.resizeWidth
                  : CONTENT_IMAGE_MAX_WIDTH
              )
              if (!allowsMultipleSelection) return resizedAsset
              if (allowsMultipleSelection && resizedAsset.assets?.[0]) {
                asset = resizedAsset.assets[0]
              }
            }
            continue
          case 'reject':
            if ('size' in fileInfo && fileInfo.size > fileSizeLimitation.limitBytes) {
              if (!allowsMultipleSelection) return 'invalidFileSize'

              imagePickerResult.assets.splice(i, 1)
            }
            continue
        }
      }

      return imagePickerResult
    },
    [verifyPermissions, allowsMultipleSelection, selectionLimit]
  )

  return {
    pickImages,
  }
}
