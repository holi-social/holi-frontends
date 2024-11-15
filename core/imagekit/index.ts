import { gql, useMutation } from '@apollo/client'
import ImageKit from 'imagekit-javascript'

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL || process.env.IMAGEKIT_URL || ''
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY || ''

const GET_IMAGEKIT_AUTH = gql`
  mutation GetImageKitAuth {
    getImagekitAuthParams {
      token
      signature
      expire
    }
  }
`

interface ImageKitAuthResponse {
  getImagekitAuthParams: {
    token: string
    signature: string
    expire: string
  }
}

export const useImageUpload = () => {
  const [getImageKitAuth] = useMutation<ImageKitAuthResponse>(GET_IMAGEKIT_AUTH)

  const uploadImage = async (file: File | Blob, fileName: string) => {
    try {
      // Get authentication parameters
      const authResponse = await getImageKitAuth()

      if (!authResponse.data) {
        throw new Error('Failed to get ImageKit authentication parameters')
      }

      const { token, signature, expire } = authResponse.data.getImagekitAuthParams

      // Initialize ImageKit instance
      const imagekit = new ImageKit({
        urlEndpoint,
        publicKey,
      })

      // Upload the image
      const result = await imagekit.upload({
        file,
        fileName: `${Date.now()}_${fileName}`,
        useUniqueFileName: true,
        signature,
        token,
        expire: Number.parseInt(expire),
      })

      return result.url
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }

  const uploadImages = async (files: Array<{ file: File | Blob; fileName: string }>) => {
    try {
      // Get authentication parameters once for all uploads
      const authResponse = await getImageKitAuth()

      if (!authResponse.data) {
        throw new Error('Failed to get ImageKit authentication parameters')
      }

      const { token, signature, expire } = authResponse.data.getImagekitAuthParams

      // Initialize ImageKit instance
      const imagekit = new ImageKit({
        urlEndpoint,
        publicKey,
      })

      // Upload all images in parallel
      const uploadPromises = files.map(({ file, fileName }) =>
        imagekit.upload({
          file,
          fileName: `${Date.now()}_${fileName}`,
          useUniqueFileName: true,
          signature,
          token,
          expire: Number.parseInt(expire),
        })
      )

      const results = await Promise.all(uploadPromises)
      return results.map((result) => result.url)
    } catch (error) {
      console.error('Bulk image upload failed:', error)
      throw error
    }
  }

  return { uploadImage, uploadImages }
}
