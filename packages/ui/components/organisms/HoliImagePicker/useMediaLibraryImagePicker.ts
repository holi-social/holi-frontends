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
  return new Promise((resolve) => {
    try {
      Image.getSize(
        imageUri,
        (width, height) => {
          resolve({ width, height })
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (error) => {
          // Return default values if we can't get the size

          resolve({ width: CONTENT_IMAGE_MAX_WIDTH, height: CONTENT_IMAGE_MAX_HEIGHT })
        }
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback to default values on any error
      resolve({ width: CONTENT_IMAGE_MAX_WIDTH, height: CONTENT_IMAGE_MAX_HEIGHT })
    }
  })
}

const resizeImage = async (
  asset: ImagePickerAsset,
  maxWidth: number,
  maxHeight: number
): Promise<ImagePickerResult> => {
  try {
    // Get current image dimensions with fallback
    let imageSize
    try {
      imageSize = await getImageSize(asset.uri)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Use default dimensions if size detection fails
      imageSize = { width: maxWidth, height: maxHeight }
    }

    // Calculate resize dimensions while maintaining aspect ratio
    let resizeWidth = Math.min(imageSize.width, maxWidth)
    let resizeHeight = Math.min(imageSize.height, maxHeight)

    if (imageSize.width > maxWidth || imageSize.height > maxHeight) {
      const widthRatio = maxWidth / imageSize.width
      const heightRatio = maxHeight / imageSize.height
      const ratio = Math.min(widthRatio, heightRatio)

      resizeWidth = Math.floor(imageSize.width * ratio)
      resizeHeight = Math.floor(imageSize.height * ratio)
    }

    // Ensure we have valid dimensions
    resizeWidth = Math.max(1, Math.min(resizeWidth, maxWidth))
    resizeHeight = Math.max(1, Math.min(resizeHeight, maxHeight))

    // Prepare resize actions
    const resizeActions = [{ resize: { width: resizeWidth, height: resizeHeight } }]
    const resizeSaveOptions = {
      compress: 0.7, // Slightly more compression
      format: SaveFormat.JPEG,
      base64: false,
    }

    // Perform the resize operation
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Return original asset if resize fails
    return {
      canceled: false,
      assets: [asset],
    } as ImagePickerResult
  }
}

export type HoliImagePickerResult = 'missingPermissions' | 'technicalError' | 'invalidFileSize' | ImagePickerResult

export const useMediaLibraryImagePicker = (allowsMultipleSelection = false, selectionLimit = 3) => {
  const [mediaLibraryPermissionInfo, requestMediaLibraryPermission] = useMediaLibraryPermissions()

  const verifyPermissions = useCallback(async () => {
    if (!mediaLibraryPermissionInfo) return true // Default to true if info is not available

    try {
      // It is necessary to request even if already denied, because the user might have changed settings
      if (
        mediaLibraryPermissionInfo.status === PermissionStatus.UNDETERMINED ||
        mediaLibraryPermissionInfo.status === PermissionStatus.DENIED
      ) {
        const permissionResponse = await requestMediaLibraryPermission()
        return permissionResponse.granted
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Continue anyway if permission check fails
    }

    return true
  }, [mediaLibraryPermissionInfo, requestMediaLibraryPermission])

  const pickImages = useCallback(
    async (fileSizeLimitation: HoliImagePickerFileSizeLimitation) => {
      try {
        const hasPermission = await verifyPermissions()
        if (!hasPermission) return 'missingPermissions'

        let imagePickerResult
        try {
          imagePickerResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: !allowsMultipleSelection,
            quality: 0.2,
            base64: false, // Set to false to reduce memory usage
            allowsMultipleSelection,
            selectionLimit,
            exif: false, // Don't need EXIF data
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          return 'technicalError'
        }

        if (imagePickerResult.canceled) {
          return imagePickerResult
        }

        // Process each selected asset
        const processedAssets: ImagePickerAsset[] = []

        for (const asset of imagePickerResult.assets) {
          try {
            let processedAsset = asset
            let fileInfo
            let imageInfo

            // Safely get file info
            try {
              fileInfo = await getInfoAsync(asset.uri)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              fileInfo = { size: 0 }
            }

            // Safely get image dimensions
            try {
              imageInfo = await getImageSize(asset.uri)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              imageInfo = { width: 0, height: 0 }
            }

            // Always resize large images to prevent crashes
            const needsResize =
              ('size' in fileInfo && fileInfo.size > 2000000) || // Lower threshold to 2MB
              imageInfo.width > CONTENT_IMAGE_MAX_WIDTH ||
              imageInfo.height > CONTENT_IMAGE_MAX_HEIGHT

            if (needsResize) {
              const maxWidth =
                fileSizeLimitation.type === 'resize' && fileSizeLimitation.resizeWidth
                  ? Math.min(fileSizeLimitation.resizeWidth, CONTENT_IMAGE_MAX_WIDTH)
                  : CONTENT_IMAGE_MAX_WIDTH

              try {
                const resizedResult = await resizeImage(asset, maxWidth, CONTENT_IMAGE_MAX_HEIGHT)
                if (resizedResult.assets?.[0]) {
                  processedAsset = resizedResult.assets[0]
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error) {
                // Continue with original asset if resize fails
              }
            }

            // For 'reject' type, still check size after resizing
            if (fileSizeLimitation.type === 'reject') {
              try {
                const processedFileInfo = await getInfoAsync(processedAsset.uri)
                if ('size' in processedFileInfo && processedFileInfo.size > fileSizeLimitation.limitBytes) {
                  if (!allowsMultipleSelection) return 'invalidFileSize'
                  // Skip this asset for multiple selection
                  continue
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error) {
                // Continue with the asset if we can't check size
              }
            }

            processedAssets.push(processedAsset)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // If processing fails, try to use original asset
            try {
              processedAssets.push(asset)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (innerError) {
              // Skip this asset if we can't even add the original
            }
          }
        }

        // Return the processed result
        if (processedAssets.length === 0 && imagePickerResult.assets.length > 0) {
          // All images were rejected due to size
          return 'invalidFileSize'
        }

        return {
          canceled: false,
          assets: processedAssets,
        } as ImagePickerResult
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return 'technicalError'
      }
    },
    [verifyPermissions, allowsMultipleSelection, selectionLimit]
  )

  return {
    pickImages,
  }
}
