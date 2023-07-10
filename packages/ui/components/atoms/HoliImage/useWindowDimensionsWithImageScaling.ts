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

const normalizeWebDimension = (widthOrHeight: number) => {
  // flooring so images are rather a bit smaller than exact pixel
  return Platform.OS === 'web' ? webCacheBucketSize * Math.floor(widthOrHeight / webCacheBucketSize) : widthOrHeight
}

export const useWindowDimensionsWithImageScaling = (
  { relativeWidth = 1, relativeHeight = 1 }: ImageScalingParams = { relativeWidth: 1, relativeHeight: 1 }
): ImageScaledSize => {
  const { width, height, scale, fontScale } = useWindowDimensions()
  // such that there are only a limited amount of cache keys available
  const imageWidth = Math.max(
    // so values below webCacheBucketSize don't become 0
    webCacheBucketSize,
    Math.min(Math.ceil(relativeWidth * normalizeWebDimension(width)), maxWidth)
  )
  const imageHeight = Math.max(
    // so values below webCacheBucketSize don't become 0
    webCacheBucketSize,
    Math.ceil(relativeHeight * normalizeWebDimension(height))
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
