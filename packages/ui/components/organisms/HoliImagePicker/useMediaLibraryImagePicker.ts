import {
  ImagePickerAsset,
  ImagePickerOptions,
  PermissionStatus,
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
} from 'expo-image-picker'
import { useCallback, useState } from 'react'

import { displayError } from '@holi/core/errors/helpers'

export const useMediaLibraryImagePicker = () => {
  const [image, setImage] = useState<ImagePickerAsset>()
  const [mediaLibraryPermissionInfo, requestMediaLibraryPermission] = useMediaLibraryPermissions()

  const verifyPermissions = useCallback(async () => {
    if (!mediaLibraryPermissionInfo) return false

    if (mediaLibraryPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestMediaLibraryPermission()
      return permissionResponse.granted
    }

    if (mediaLibraryPermissionInfo.status === PermissionStatus.DENIED) {
      // TODO: provide i18n message
      displayError(new Error('Please, give access to your Fotos.'), 'Media Library permission denied')
      return false
    }

    return true
  }, [mediaLibraryPermissionInfo, requestMediaLibraryPermission])

  const pickImage = useCallback(
    async (pickerOptions: ImagePickerOptions) => {
      const hasPermission = await verifyPermissions()

      if (!hasPermission) return

      const result = await launchImageLibraryAsync(pickerOptions)
      const img = result.assets?.[0]

      if (!result.canceled) {
        setImage(img)

        return img
      }
    },
    [verifyPermissions]
  )

  return {
    image,
    pickImage,
  }
}
