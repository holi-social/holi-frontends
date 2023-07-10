import { Platform, useWindowDimensions } from 'react-native'

interface ImageScalingParams {
  relativeWidth?: number
  relativeHeight?: number
}

interface ImageScaledSize {
  imageWidth: number
  imageHeight: number
  // affected by window sizing!
  screenWidth: number
  screenHeight: number
  scale: number
  fontScale: number
}

const webCacheBucketSize = 250
const maxWidth = 1200

export const useWindowDimensionsWithImageScaling = (
  { relativeWidth = 1, relativeHeight = 1 }: ImageScalingParams = { relativeWidth: 1, relativeHeight: 1 }
): ImageScaledSize => {
  const { width, height, scale, fontScale } = useWindowDimensions()
  // such that there are only a limited amount of cache keys available
  const imageWidth = Math.max(
    // so values below < cacheBucketSize don't become 0
    webCacheBucketSize,
    Math.min(
      // flooring so images are rather a bit smaller than exact pixel
      relativeWidth * (Platform.OS === 'web' ? webCacheBucketSize * Math.floor(width / webCacheBucketSize) : width),
      maxWidth
    )
  )
  const imageHeight = Math.max(
    // so values below < cacheBucketSize don't become 0
    webCacheBucketSize,
    // flooring so images are rather a bit smaller than exact pixel
    relativeHeight * (Platform.OS === 'web' ? webCacheBucketSize * Math.floor(height / webCacheBucketSize) : height)
  )
  return {
    imageWidth,
    imageHeight,
    screenWidth: width,
    screenHeight: height,
    scale,
    fontScale,
  }
}
