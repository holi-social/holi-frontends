import { getInfoAsync } from 'expo-file-system'
import {
  ImageInfo,
  ImagePickerOptions,
  PermissionStatus,
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
} from 'expo-image-picker'
import { useCallback, useState } from 'react'

import { displayError } from '@holi/core/errors/helpers'
import { useFileSizeValidation } from '@holi/ui/components/organisms/HoliImagePicker/useFileSizeValidation'

export type HoliImagePickerOptions = ImagePickerOptions & { maxFileSizeInMB?: number }

export const useMediaLibraryImagePicker = () => {
  const [image, setImage] = useState<ImageInfo>()
  const [mediaLibraryPermissionInfo, requestMediaLibraryPermission] = useMediaLibraryPermissions()
  const isFileSizeValid = useFileSizeValidation()

  const verifyPermissions = useCallback(async () => {
    if (!mediaLibraryPermissionInfo) return false

    if (mediaLibraryPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestMediaLibraryPermission()
      return permissionResponse.granted
    }

    if (mediaLibraryPermissionInfo.status === PermissionStatus.DENIED) {
      // TODO: provide i18n message
      displayError(new Error('Please, give access to your photos.'), 'Media Library permission denied')
      return false
    }

    return true
  }, [mediaLibraryPermissionInfo, requestMediaLibraryPermission])

  const pickImage = useCallback(
    async ({ maxFileSizeInMB, ...pickerOptions }: HoliImagePickerOptions) => {
      const hasPermission = await verifyPermissions()

      if (!hasPermission) return

      const image = await launchImageLibraryAsync(pickerOptions)

      if (image.cancelled) {
        return
      }

      if (maxFileSizeInMB) {
        const fileInfo = await getInfoAsync(image.uri)
        if (!isFileSizeValid({ fileSize: fileInfo.size, maxFileSizeInMB })) {
          return
        }
      }

      setImage(image)

      return image
    },
    [verifyPermissions, isFileSizeValid]
  )

  return {
    image,
    pickImage,
  }
}
