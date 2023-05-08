import type { ImageContentFit } from 'expo-image'
import type { ImageURISource } from 'react-native'
import { PixelRatio, Platform } from 'react-native'

export interface ImageSource {
  uri: string
  width: number
  height: number
}

export interface HoliImageProps {
  source: ImageSource[] | ImageURISource
  label: string
  resizeMode?: ImageContentFit
  /**
   * Source sizes for web, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
   * The default value assumes the image will span the whole screen width until maxScreenWidth.
   */
  sizes?: string
}

/** @description It handles the correct pixel density for native host platforms.
 * It returns the same input value for the web. Different sizes in the web are
 * regulated by the `srcSet` attribute. */
export const calcPixelRatioSize = (value: number): number => {
  if (Platform.OS === 'web') return value
  return PixelRatio.getPixelSizeForLayoutSize(value)
}

/** @description Appends the ImageKit image transformation query parameter to
 * the source URL and returns the source. */
export const setImageKitParams = (source: ImageSource | ImageURISource): ImageSource | ImageURISource => {
  if (!source.uri) return source
  if (!source.width && !source.height) return source

  try {
    const url = new URL(source.uri)

    // String concatination is much faster than template strings. Please do not replace.
    const width = source.width ? 'w-' + calcPixelRatioSize(source.width) : ''
    const height = source.height ? 'h-' + calcPixelRatioSize(source.height) : ''
    const params = width && height ? width + ',' + height : width + height

    url.searchParams.set('tr', params)

    return { ...source, uri: url.href }
  } catch (error) {
    return source
  }
}

/** @description It handles the image sources, array, or single source and
 * appends the query parameters for ImageKit to deliver the correct image sizes.
 * It can be configured using the `width` and `height`. */
export const transformSourcesURL = (source: ImageSource[] | ImageURISource) => {
  if (!Array.isArray(source)) {
    return setImageKitParams(source)
  }

  return source.map(setImageKitParams)
}
