import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Image as ReactNativeImage } from 'react-native'
import { AccessibilityProps } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { transformSourcesURL } from '@holi/ui/components/atoms/HoliImage/resizing'
import { MobileImageProps } from '@holi/ui/components/atoms/HoliImage/types'

const useReactNativeImageForComparison = false

// https://github.com/expo/expo/issues/21921 is fixed, so we can use expo-image again
const HoliImage = ({ source, blurhash, label, style, resizeMode = 'cover', testID, onLayout }: MobileImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !!label,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }

  const transformedSource = transformSourcesURL(source)

  if (useReactNativeImageForComparison) {
    // no blurhash available
    return (
      <ReactNativeImage
        source={transformedSource}
        style={style}
        resizeMode={resizeMode}
        testID={testID}
        onLayout={onLayout}
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
      onLayout={onLayout}
      {...accessibilityProps}
    />
  )
}

export default HoliImage
