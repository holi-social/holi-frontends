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

import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useFileSizeValidation } from '@holi/ui/components/organisms/HoliImagePicker/useFileSizeValidation'

export type HoliImagePickerOptions = ImagePickerOptions & { maxFileSizeInMB?: number }

export const useMediaLibraryImagePicker = () => {
  const [images, setImages] = useState<ImagePickerAsset[]>([])
  const [mediaLibraryPermissionInfo, requestMediaLibraryPermission] = useMediaLibraryPermissions()
  const isFileSizeValid = useFileSizeValidation()
  const { openToast } = useToast()
  const { t } = useTranslation()

  const verifyPermissions = useCallback(async () => {
    if (!mediaLibraryPermissionInfo) return false

    if (mediaLibraryPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestMediaLibraryPermission()
      return permissionResponse.granted
    }

    if (mediaLibraryPermissionInfo.status === PermissionStatus.DENIED) {
      openToast(t('global.permissions.mediaLibrary.denied'), HoliToastType.ERROR)
      return false
    }

    return true
  }, [mediaLibraryPermissionInfo, requestMediaLibraryPermission, openToast, t])

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
