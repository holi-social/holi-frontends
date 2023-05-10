import { ReactNativeFile } from 'apollo-upload-client'
import { Asset } from 'expo-asset'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

const e2e = {
  userId: Constants.manifest?.extra?.environment !== 'production' && Constants.manifest?.extra?.e2e.userId,
  testImage: require('@holi/ui/assets/img/illustrations/illustration_welcome.png'),
}

export const mockImageUploadForE2E = async (userId?: string | null): Promise<ImageInfo | undefined> => {
  if (Platform.OS !== 'web' && userId === e2e.userId) {
    const [asset] = await Asset.loadAsync(e2e.testImage)
    const { uri, width, height } = asset
    if (!uri || !width || !height) {
      return
    }
    return {
      uri,
      width,
      height,
      blob: new ReactNativeFile({
        uri,
        name: 'illustration_welcome.png',
        type: 'image/png',
      }),
      base64: '',
    }
  }
}
