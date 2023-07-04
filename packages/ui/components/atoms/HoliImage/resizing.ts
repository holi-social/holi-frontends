import { PixelRatio, Platform } from 'react-native'

import { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'

/** @description It handles the correct pixel density for native host platforms.
 * It returns the same input value for the web. Different sizes in the web can
 * also be regulated by the `srcSet` attribute. */
const calcPixelRatioSize = (value: number | undefined): number | undefined => {
  if (value === undefined) {
    return value
  }

  if (Platform.OS === 'web') {
    const pixelDensity = window.devicePixelRatio // hint: can be affected by zoom!
    const halfRoundedPixelDensity = Math.round(pixelDensity * 2) / 2 // to limit the amount of cache buckets
    return halfRoundedPixelDensity * value
  }
  return PixelRatio.getPixelSizeForLayoutSize(value)
}

/** @description Checks if `uri` of ImageSource is Base64 */
const isImageSourceURIBase64 = ({ uri }: ImageSource) => !!uri?.startsWith('data:image')

/** @description Appends the ImageKit image transformation query parameter to
 * the source URL and returns the source. */
export const setScalingParams = (source: ImageSource): ImageSource => {
  if (!source.width && !source.height) return source
  if (isImageSourceURIBase64(source)) return source

  const calculatedWidth = calcPixelRatioSize(source.width)
  const calculatedHeight = calcPixelRatioSize(source.height)

  if (source.uri.startsWith('https://ik.imagekit.io/')) {
    try {
      const url = new URL(source.uri)

      // String concatenation is much faster than template strings. Please do not replace.
      const width = calculatedWidth ? 'w-' + calculatedWidth : ''
      const height = calculatedHeight ? 'h-' + calculatedHeight : ''
      const params = width && height ? width + ',' + height : width + height

      // potentially overrides previous value, if accidentally present
      url.searchParams.set('tr', params)

      return { ...source, uri: url.href }
    } catch (error) {
      return source
    }
  }

  return source
}

/** @description It handles the image sources, array, or single source and
 * appends the query parameters for ImageKit to deliver the correct image sizes.
 * It can be configured using the `width` and `height`. */
export const transformSourcesURL = (source: ImageSource | ImageSource[]) => {
  if (!Array.isArray(source)) {
    return setScalingParams(source)
  }

  return source.map(setScalingParams)
}
