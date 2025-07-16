/* eslint-disable no-restricted-imports */
import { PixelRatio, Platform } from 'react-native'
import { isSSR } from '@holi/core/helpers/isSSR'
import type { MultiPlatformImageSource } from 'holi-bricks/components/image/type'
import coverGreen from '@holi/ui/assets/img/placeholder/placeholder-green.svg'
import coverYellow from '@holi/ui/assets/img/placeholder/placeholder-yellow.svg'
import coverPurple from '@holi/ui/assets/img/placeholder/placeholder-purple.svg'
import coverBlue from '@holi/ui/assets/img/placeholder/placeholder-blue.svg'
import { config } from 'holi-bricks/config'
// meant for dev: you see the dimension that would be loaded as a black image
// useful when determining whether the correct srcSet is loaded
const debugMode = false

export const isRemoteSource = (source: string | number): source is string => {
  if (Platform.OS === 'web') {
    return /^(https?:)?\/\//i.test(source as string)
  }

  return typeof source === 'string'
}

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
const isImageSourceURIBase64 = (uri: string) => !!uri?.startsWith('data:image')

export const buildProxiedImageUrl = (
  calculatedWidth: number | undefined,
  calculatedHeight: number | undefined,
  encodedOriginalUrl: string,
  fillDown = true
) => {
  const imagesUrl = config.isProduction ? 'https://images.holi.social' : 'https://dev-images.holi.social'
  const width = calculatedWidth ? ':' + calculatedWidth : ':'
  const height = calculatedHeight ? ':' + calculatedHeight : ''
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

const FALLBACK_IMAGE_URL =
  Platform.OS === 'android'
    ? 'https://ik.imagekit.io/holidev/404_square.png'
    : 'https://ik.imagekit.io/holidev/404_square.svg'

/** @description Appends the ImageKit image transformation query parameter to
 * the source URL and returns the source. */
export const transformSource = (source: MultiPlatformImageSource, width: number, height: number): string | number => {
  if (typeof source === 'number') return source

  const uri = source ?? FALLBACK_IMAGE_URL
  const calculatedWidth = calcPixelRatioSize(width)
  const calculatedHeight = calcPixelRatioSize(height)

  if (debugMode) {
    const width = calculatedWidth ?? calcPixelRatioSize(MAX_IMAGE_DIMENSION)
    const height = calculatedHeight ?? calcPixelRatioSize(MAX_IMAGE_DIMENSION)
    const padding = encodeURIComponent('') // add spaces, if needed to see image size
    const text = padding + (calculatedWidth ?? '∞') + '×' + (calculatedHeight ?? '∞') + padding
    return 'https://dummyimage.com/' + width + 'x' + height + '/000/fff.jpg?text=' + text
  } else if (!isRemoteSource(source)) {
    // we've seen imagekit requests with file urls, we should not wrap these
    // also, file uris show up after using Expos ImageManipulator in context of HoliImagePicker
    return source
  } else if (!calculatedWidth && !calculatedHeight) {
    // Due to app crashes, we don't allow fully unbounded images
    return buildProxiedImageUrl(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION, encodeURIComponent(uri), false)
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
      return url.href
    } catch (error) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      return source
    }
  } else if (uri.startsWith('https://dev-images.holi.social/') || uri.startsWith('https://images.holi.social/')) {
    // backend hack to force a maximum size when no frontend image width/height is set
    // we rewrite this here with our params
    return buildProxiedImageUrl(calculatedWidth, calculatedHeight, uri.replace(/^.+\/plain\//, ''))
  } else {
    // unknown image provider, default scaling
    return buildProxiedImageUrl(calculatedWidth, calculatedHeight, encodeURIComponent(uri))
  }
}

/**
 * @description
 * Returns deterministically one of multiple elements based on the provided key.
 * This function takes a set of elements and a key (like e.g. a UUID), then computes a hash
 * value based on the provided key and returns one consistent element from the provided set.
 * This ensures that the element will always be the same for a given set of elements and a given key.
 *
 * @param elements - An array of elements to choose from.
 * @param {string} key - The key for which the element will be generated.
 * @returns {T} - An element selected from the provided ones.
 *
 * @example
 * const colors = ['#FF5733', '#33FF57', '#3357FF'];
 * const initials = 'JD';
 * const bgColor = getDeterministicValue(colors, initials);
 * getDeterministicValue will be one of the values from the colors array, consistently based on the initials.
 */
export const pickByHash = <T>(elements: T[], key: string): T => {
  if (!elements?.length) throw "Elements can't be empty"
  let hash = 0
  for (let i = 0; i < key?.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % elements.length

  return elements[index || 0]
}

const placeholderImages = [coverGreen, coverBlue, coverPurple, coverYellow]
/**
 * @description
 * Generates a placeholder image based on the provided initials.
 * This function takes a key (like e.g. a UUID) and returns a consistent image from a predefined set.
 * This ensures that the placeholder image will always be the same for a given key.
 *
 * @param {string} key - The key for which the placeholder image will be generated.
 * @returns {MultiPlatformImageSource} - A placeholder image selected from the provided placeholder images.
 *
 * @example
 * const taskId = 'ea7317b4-69c1-436b-80fe-66e1f4957616';
 * const fallbackImage = getPlaceholderImage(taskId);
 * getPlaceholderImage will be one of the predefined placeholder images, consistently based on the taskId.
 */
export const getPlaceholderImage = (key: string): MultiPlatformImageSource => pickByHash(placeholderImages, key)
