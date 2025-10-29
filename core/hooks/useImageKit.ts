import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import type { ImageKitAuthParams } from '@holi/api/graphql/graphql-codegen'
import type { ImagePickerAsset } from 'expo-image-picker'
import { Platform } from 'react-native'

// Type for React Native FormData file objects
type ReactNativeFile = {
  uri: string
  type: string
  name: string
}

const getImageKitAuthParams = gql`
  mutation GetImagekitAuthParams {
    getImagekitAuthParams {
      token
      signature
      expire
      publicKey
    }
  }
`

type ImageKitAuthParamsResponse = {
  getImagekitAuthParams: ImageKitAuthParams
}

export const useImageKit = () => {
  const [getAuthParams] = useMutation<ImageKitAuthParamsResponse>(getImageKitAuthParams)

  const uploadImage = async (file: ImagePickerAsset, fileName: string): Promise<string> => {
    try {
      const { data } = await getAuthParams()
      if (!data) {
        throw Error('Failed to get image kit auth params')
      }
      const authParams = data.getImagekitAuthParams
      const formData = new FormData()

      if (Platform.OS === 'web') {
        // For web, we need to fetch the blob from the URI
        const response = await fetch(file.uri)
        const blob = await response.blob()
        formData.append('file', blob, fileName)
      } else {
        // For React Native, we use the file uri with proper structure
        const reactNativeFile: ReactNativeFile = {
          uri: file.uri,
          type: file.mimeType || 'image/jpeg',
          name: fileName,
        }
        formData.append('file', reactNativeFile as unknown as Blob)
      }

      formData.append('fileName', fileName)
      formData.append('token', authParams.token)
      formData.append('signature', authParams.signature)
      formData.append('expire', authParams.expire.toString())
      formData.append('publicKey', authParams.publicKey)

      const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.message || 'ImageKit upload failed')
      }

      return responseData.url
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('ImageKit upload failed')
    }
  }

  return { uploadImage }
}
