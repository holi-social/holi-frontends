import { useCallback, useRef, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'

interface GetTransformedImageUriOptions {
  imageUri: string
  imageSize?: [number, number]
  transformSize: [number, number]
  aspectRatio?: string
}

/*
 *
 * Function to get URI for transformed Image from Imagekit.io
 * "imageSize" and "transformSize" params are of type array where first element is "width" and second is "height" (tuple like)
 * if "imageSize" is not passed, always perform transformation
 * if widht or height in "transformSize" is smaller than in "imageSize", perform transformation
 * if "aspectRatio" is passed, use only "width" and "aspectRatio" for treansformation
 *
 */
export const getTransformedImageUri = ({
  imageUri,
  imageSize, // if "imageSize" not passed, always transform
  transformSize,
  aspectRatio,
}: GetTransformedImageUriOptions) => {
  const [width, height] = transformSize

  const shouldResize = !imageSize || imageSize[0] > width || imageSize[1] > height
  const imageUriArray = imageUri.split('/')

  if (shouldResize) {
    imageUriArray.splice(-1, 0, `tr:w-${width},${aspectRatio ? `ar-${aspectRatio}` : `h-${height}`}`)
  }

  return {
    uri: imageUriArray.join('/'),
    width,
    height,
  }
}

/*
 *
 * Function gets size of some element first and than using this size gets URI for transformed Image from Imagekit.io
 * return object with "onLayout" and "uri" props where:
 *  - "onLayout" is event handler for container to get its size
 *  - "uri" is reactive value for transformed URI, it is "undefined" in the beginning
 */
export const useContainerSizeForImage = (imageUri: string, getLayoutOnce = false) => {
  const [transformedUri, setTransformedUri] = useState<string>()
  const hasGottenOnce = useRef(false)

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (getLayoutOnce && hasGottenOnce.current) return

      const { width, height } = event.nativeEvent.layout
      const { uri } = getTransformedImageUri({
        imageUri,
        transformSize: [width, height],
        aspectRatio: '343-236',
      })

      setTransformedUri(uri)
      hasGottenOnce.current = true
    },
    [imageUri, getLayoutOnce]
  )

  return { uri: transformedUri, onLayout }
}
