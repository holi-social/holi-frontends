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

const holiImageScaling = (
  isProd: boolean,
  calculatedWidth: number | undefined,
  calculatedHeight: number | undefined,
  encodedOriginalUrl: string
) => {
  const uriBase = isProd ? 'https://images.holi.social/' : 'https://dev-images.holi.social/'
  const width = calculatedWidth ? ':' + calculatedWidth : ':'
  const height = calculatedHeight ? ':' + calculatedHeight : ''
  // https://docs.imgproxy.net/generating_the_url?id=crop
  // - 'crop' section seems to be required, '0:0' means using full width/height of source
  // https://docs.imgproxy.net/generating_the_url?id=resize
  // - 'resize' section fills given space by width and height and crops overhanging parts
  // - we use 'fill-down' instead of 'fill' to keep the requested aspect ratio,
  //   even when images are smaller than the requested sizes
  // - cropping is done with centered gravity
  // - pictures are not enlarged to requested size (to keep bandwidth lower)
  // https://docs.imgproxy.net/generating_the_url?id=format
  // - 'ext' section forces a file format, we use webp (better than jpg on 80% quality)
  // https://docs.imgproxy.net/generating_the_url?id=quality
  // - 'quality' section forces a compression quality, we use the default 80% explicitly
  return uriBase + 'crop:0:0/resize:fill-down' + width + height + '/ext:webp/quality:80/plain/' + encodedOriginalUrl
}

/** @description Appends the ImageKit image transformation query parameter to
 * the source URL and returns the source. */
export const setScalingParams = (source: ImageSource): ImageSource => {
  if (!source.width && !source.height) return source
  if (isImageSourceURIBase64(source)) return source

  const uri = source.uri
  const calculatedWidth = calcPixelRatioSize(source.width)
  const calculatedHeight = calcPixelRatioSize(source.height)

  if (uri.startsWith('https://ik.imagekit.io/')) {
    try {
      const url = new URL(uri)

      // String concatenation is much faster than template strings. Please do not replace.
      const width = calculatedWidth ? 'w-' + calculatedWidth : ''
      const height = calculatedHeight ? 'h-' + calculatedHeight : ''
      const params = width && height ? width + ',' + height : width + height

      // will intentionally override previous value, if present
      url.searchParams.set('tr', params)

      return { ...source, uri: url.href }
    } catch (error) {
      return source
    }
  } else if (uri.startsWith('https://betterplace-assets.betterplace.org/')) {
    // betterplace images already come in pre-sized source arrays
    return source
  } else if (uri.startsWith('https://dev-images.holi.social/') || uri.startsWith('https://images.holi.social/')) {
    // backend hack to force a maximum size when no frontend image width/height is set
    // we rewrite this here with our params
    const newUri = holiImageScaling(
      uri.startsWith('https://images'),
      calculatedWidth,
      calculatedHeight,
      uri.replace(/^.+\/plain\//, '')
    )
    return { ...source, uri: newUri }
  } else {
    // unknown image provider, default scaling
    // TODO detect production
    const newUri = holiImageScaling(false, calculatedWidth, calculatedHeight, encodeURIComponent(uri))
    return { ...source, uri: newUri }
  }
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
