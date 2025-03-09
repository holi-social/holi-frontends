import { PixelRatio, Platform } from 'react-native'

import { isProduction } from '@holi/core/helpers/environment'
import { isSSR } from '@holi/core/helpers/isSSR'
import type { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'

// meant for dev: you see the dimension that would be loaded as a black image
// useful when determining whether the correct srcSet is loaded
const debugMode = false

/** @description It handles the correct pixel density for native host platforms.
 * It returns the same input value for the web. Different sizes in the web can
 * also be regulated by the `srcSet` attribute. */
const calcPixelRatioSize = (value: number | undefined): number | undefined => {
  if (value === undefined) {
    return value
  }

  if (Platform.OS === 'web') {
    if (isSSR) {
      return value * 2
    }
    const pixelDensity = window.devicePixelRatio // hint: can be affected by zoom! and can be a float, but we must return an integer from the function!
    const halfRoundedPixelDensity = Math.round(pixelDensity + 0.25) // to limit the amount of cache buckets; +0.25 in order to be mostly backwards compatible with a previous version
    return halfRoundedPixelDensity * value
  }
  return PixelRatio.getPixelSizeForLayoutSize(value)
}

/** @description Checks if `uri` of ImageSource is Base64 */
const isImageSourceURIBase64 = ({ uri }: ImageSource) => !!uri?.startsWith('data:image')

const holiImageScaling = (
  calculatedWidth: number | undefined,
  calculatedHeight: number | undefined,
  encodedOriginalUrl: string,
  fillDown = true
) => {
  const imagesUrl = isProduction ? 'https://images.holi.social' : 'https://dev-images.holi.social'
  const width = calculatedWidth ? ':' + calculatedWidth : ':'
  const height = calculatedHeight ? ':' + calculatedHeight : ''
  // https://docs.imgproxy.net/generating_the_url?id=crop
  // - 'crop' section seems to be required, '0:0' means using full width/height of source
  // https://docs.imgproxy.net/generating_the_url?id=resize
  // - 'resize' section fills given space by width and height and crops overhanging parts
  // - when filling, we use 'fill-down' instead of 'fill' to keep the requested aspect ratio,
  //   even when images are smaller than the requested sizes
  // - we use fit for a simple bounding box approach
  // - cropping is done with centered gravity
  // - pictures are not enlarged to requested size (to keep bandwidth lower)
  // https://docs.imgproxy.net/generating_the_url?id=format
  // - 'ext' section forces a file format, we use webp (better than jpg on 80% quality)
  // https://docs.imgproxy.net/generating_the_url?id=quality
  // - 'quality' section forces a compression quality, we use the default 80% explicitly
  if (fillDown) {
    return (
      imagesUrl + '/crop:0:0/resize:fill-down' + width + height + '/ext:webp/quality:80/plain/' + encodedOriginalUrl
    )
  } else {
    return imagesUrl + '/crop:0:0/resize:fit' + width + height + '/ext:webp/quality:80/plain/' + encodedOriginalUrl
  }
}

// App crashes on images too big. Max amount of pixels can be up to 2.31 million (a square bounding box of 1520x1520).
// As a general fix, we limit unbounded images to this, respectively a smaller, bounding box.
// This is still unsafe for the odd case where a "rectangly" image is passed in with only defining a width or height where
// the defined dimension is the (much) shorter side of the image.
const MAX_IMAGE_DIMENSION = 1200

/** @description Appends the ImageKit image transformation query parameter to
 * the source URL and returns the source. */
export const setScalingParams = (source: ImageSource): ImageSource => {
  const uri = ensureUriOrFallbackUri(source.uri)
  const calculatedWidth = calcPixelRatioSize(source.width)
  const calculatedHeight = calcPixelRatioSize(source.height)

  if (debugMode) {
    const width = calculatedWidth ?? calcPixelRatioSize(MAX_IMAGE_DIMENSION)
    const height = calculatedHeight ?? calcPixelRatioSize(MAX_IMAGE_DIMENSION)
    const padding = encodeURIComponent('') // add spaces, if needed to see image size
    const text = padding + (calculatedWidth ?? '∞') + '×' + (calculatedHeight ?? '∞') + padding
    const newUri = 'https://dummyimage.com/' + width + 'x' + height + '/000/fff.jpg?text=' + text
    return { ...source, uri: newUri }
  } else if (uri.startsWith('file://')) {
    // we've seen imagekit requests with file urls, we should not wrap these
    // also, file uris show up after using Expos ImageManipulator in context of HoliImagePicker
    return source
  } else if (!calculatedWidth && !calculatedHeight) {
    // Due to app crashes, we don't allow fully unbounded images
    const newUri = holiImageScaling(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION, encodeURIComponent(uri), false)
    return { ...source, uri: newUri }
  } else if (isImageSourceURIBase64(source)) {
    return source
  } else if (uri.startsWith('https://ik.imagekit.io/')) {
    try {
      const url = new URL(uri)

      // String concatenation is much faster than template strings. Please do not replace.
      const width = calculatedWidth ? 'w-' + calculatedWidth : ''
      const height = calculatedHeight ? 'h-' + calculatedHeight : ''
      const params = width && height ? width + ',' + height : width + height

      // will intentionally override previous value, if present
      url.searchParams.set('tr', params)
      return { ...source, uri: url.href }
    } catch (error) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      return source
    }
  } else if (uri.startsWith('https://dev-images.holi.social/') || uri.startsWith('https://images.holi.social/')) {
    // backend hack to force a maximum size when no frontend image width/height is set
    // we rewrite this here with our params
    const newUri = holiImageScaling(calculatedWidth, calculatedHeight, uri.replace(/^.+\/plain\//, ''))
    return { ...source, uri: newUri }
  } else {
    // unknown image provider, default scaling
    const newUri = holiImageScaling(calculatedWidth, calculatedHeight, encodeURIComponent(uri))
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

const ensureUriOrFallbackUri = (uri?: string) => {
  if (uri) return uri
  return Platform.OS === 'android'
    ? 'https://ik.imagekit.io/holidev/404_square.png'
    : 'https://ik.imagekit.io/holidev/404_square.svg'
}
