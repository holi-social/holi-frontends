export const getImageDimensions = (width: number, isWeb: boolean) => {
  // Use full width to avoid blurriness - default to 750 for SSR when width is 0
  const imageWidth = isWeb ? Math.min(width || 750, 750) : width
  // Maintain 16:9 aspect ratio
  const imageHeight = Math.round(imageWidth / 1.77)

  return {
    imageWidth,
    imageHeight,
  }
}
