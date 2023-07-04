import { getInfoAsync } from 'expo-file-system'
import {
  ImagePickerAsset,
  ImagePickerOptions,
  PermissionStatus,
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
} from 'expo-image-picker'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useFileSizeValidation } from '@holi/ui/components/organisms/HoliImagePicker/useFileSizeValidation'

export type HoliImagePickerOptions = ImagePickerOptions & { maxFileSizeInMB?: number }

export const useMediaLibraryImagePicker = () => {
  const [images, setImages] = useState<ImagePickerAsset[]>([])
  const [mediaLibraryPermissionInfo, requestMediaLibraryPermission] = useMediaLibraryPermissions()
  const isFileSizeValid = useFileSizeValidation()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const verifyPermissions = useCallback(async () => {
    if (!mediaLibraryPermissionInfo) return false

    if (mediaLibraryPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestMediaLibraryPermission()
      return permissionResponse.granted
    }

    if (mediaLibraryPermissionInfo.status === PermissionStatus.DENIED) {
      const errorText = t('global.permissions.mediaLibrary.denied')
      displayError(new HoliError(errorText), errorText)
      return false
    }

    return true
  }, [mediaLibraryPermissionInfo, requestMediaLibraryPermission, displayError, t])

  const pickImages = useCallback(
    async ({ maxFileSizeInMB, ...pickerOptions }: HoliImagePickerOptions) => {
      const hasPermission = await verifyPermissions()

      if (!hasPermission) return

      const image = await launchImageLibraryAsync(pickerOptions)

      if (image.canceled) {
        return
      }

      if (maxFileSizeInMB) {
        const fileInfo = await getInfoAsync(image.assets[0].uri)
        if ('size' in fileInfo && !isFileSizeValid({ fileSize: fileInfo.size, maxFileSizeInMB })) {
          return
        }
      }

      setImages(image.assets)

      return image
    },
    [verifyPermissions, isFileSizeValid]
  )

  return {
    images,
    pickImages,
  }
}
