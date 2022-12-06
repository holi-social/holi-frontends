import { useCallback, useRef, useState } from 'react'
import { ImageURISource, LayoutChangeEvent } from 'react-native'

interface GetTransformedImageUriOptions {
  imageUri: string
  imageSize?: { width: number; height: number }
  transformSize: { width: number; height?: number }
  aspectRatio?: string
}

/*
 *
 * Function to get URI for transformed Image from Imagekit.io
 * "imageSize" and "transformSize" params are of type array where first element is "width" and second is "height" (tuple like)
 * height in "transformSize" (second element) is optional, so if not defined, default aspect ratio of image will be kept
 * if "imageSize" is not passed, always perform transformation
 * if widht or height in "transformSize" is smaller than in "imageSize", perform transformation
 * if "aspectRatio" is passed, use only "width" and "aspectRatio" for transformation
 *
 */
export const getTransformedImageUri = ({
  imageUri,
  imageSize, // if "imageSize" not passed, always transform
  transformSize,
  aspectRatio,
}: GetTransformedImageUriOptions): ImageURISource => {
  const { width, height } = transformSize

  const shouldResize = !imageSize || imageSize.width > width || imageSize.height > (height ?? 0)
  const imageUriArray = imageUri.split('/')

  if (shouldResize) {
    imageUriArray.splice(-1, 0, `tr:w-${width},${aspectRatio ? `ar-${aspectRatio}` : height ? `h-${height}` : ''}`)
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
        transformSize: { width, height },
        aspectRatio: '343-236',
      })

      setTransformedUri(uri)
      hasGottenOnce.current = true
    },
    [imageUri, getLayoutOnce]
  )

  return { uri: transformedUri, onLayout }
}

export const getSizes = (breakpointWidthMatches: { breakpoint: number; width: number }[]) => {
  const sortedDescendingMatches = [...breakpointWidthMatches].sort(({ breakpoint: a }, { breakpoint: b }) => b - a)
  return (
    sortedDescendingMatches.map(({ breakpoint, width }) => `(min-width: ${breakpoint}px) ${width}px`).join(', ') +
    ', 100wv'
  )
}
