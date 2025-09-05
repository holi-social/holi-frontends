import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { type AccessibilityProps, Image as ReactNativeImage } from 'react-native'

import { transformSourcesURL } from '@holi/ui/components/atoms/HoliImage/resizing'
import type { MobileImageProps } from '@holi/ui/components/atoms/HoliImage/types'

// left in here for future possibility of speed comparison
const debugWithReactNativeImage = false

/**
 * @deprecated Use `Image` from holiBricks instead.
 */
const HoliImage = ({
  source,
  blurhash,
  label,
  style,
  resizeMode = 'cover',
  testID,
  onLayout,
  onError,
  onLoadEnd,
  'aria-hidden': ariaHidden,
}: MobileImageProps) => {
  const accessibilityProps: AccessibilityProps = {
    accessible: !!label,
    role: 'img',
    accessibilityRole: 'image',
    'aria-label': label,
    ...(ariaHidden ? { 'aria-hidden': ariaHidden } : {}),
  }

  const transformedSource = transformSourcesURL(source)

  if (debugWithReactNativeImage && (resizeMode === 'cover' || resizeMode === 'contain' || resizeMode === undefined)) {
    // no blurhash available, only applicable to certain resize modes
    return (
      <ReactNativeImage
        source={transformedSource}
        style={style}
        resizeMode={resizeMode}
        testID={testID}
        onLayout={onLayout}
        onLoadEnd={onLoadEnd}
        {...accessibilityProps}
      />
    )
  }

  return (
    <ExpoImage
      source={transformedSource}
      placeholder={blurhash}
      style={style}
      contentFit={resizeMode}
      testID={testID}
      onError={onError}
      onLayout={onLayout}
      onLoadEnd={onLoadEnd}
      {...accessibilityProps}
    />
  )
}

export default HoliImage
