import type { ImageURISource } from 'react-native'
import { PixelRatio } from 'react-native'

export interface ImageSource {
  uri: string
  width: number
  height: number
}

export interface HoliImageProps {
  source: ImageSource[] | ImageURISource
  label: string
  resizeMode?: ResizeMode
  /**
   * Source sizes for web, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
   * The default value assumes the image will span the whole screen width until maxScreenWidth.
   */
  sizes?: string
}

/**
 * These modes work the same across web and mobile and therefore are the only ones we allow.
 */
export const ResizeModes = [
  'cover',
  'contain',
  'stretch', // fill in web
  // center and repeat have no web equivalent
] as const

export type ResizeMode = (typeof ResizeModes)[number]

export const resizeModeForWeb = (resizeMode: ResizeMode): 'cover' | 'contain' | 'fill' => {
  switch (resizeMode) {
    case 'stretch':
      return 'fill'
    default:
      return resizeMode
  }
}

/** @description Appends the ImageKit image transformation query parameter to
 * the source URL and returns the source. */
export const setImageKitParams = (source: ImageSource | ImageURISource): ImageSource | ImageURISource => {
  if (!source.uri) return source
  if (!source.width && !source.height) return source

  const url = new URL(source.uri)

  // String concatination is much faster than template strings. Please do not replace.
  const width = source.width ? 'w-' + PixelRatio.getPixelSizeForLayoutSize(source.width) : ''
  const height = source.height ? 'h-' + PixelRatio.getPixelSizeForLayoutSize(source.height) : ''
  const params = width && height ? width + ',' + height : width + height

  url.searchParams.set('tr', params)

  return { ...source, uri: url.href }
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
