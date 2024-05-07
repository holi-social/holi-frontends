import { ReactNativeFile } from 'apollo-upload-client'
import Constants from 'expo-constants'
import { Image, Platform } from 'react-native'

import testImage from '@holi/ui/assets/img/illustrations/illustration_welcome.png'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

const e2e = {
  userId: Constants.expoConfig?.extra?.environment !== 'production' && Constants.expoConfig?.extra?.e2e.userId,
}

export const mockImageUploadForE2E = async (userId: string): Promise<HoliImageInfo | undefined> => {
  if (Platform.OS !== 'web' && userId === e2e.userId) {
    return {
      uri: Image.resolveAssetSource(testImage).uri,
      width: 200,
      height: 200,
      blob: new ReactNativeFile({
        uri: Image.resolveAssetSource(testImage).uri,
        name: 'illustration_welcome.png',
        type: 'image/png',
      }),
      base64: '',
    }
  }
}
