import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image'
import React from 'react'
import { Image as ReactNativeImage } from 'react-native'
import { AccessibilityProps } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { transformSourcesURL } from '@holi/ui/components/atoms/HoliImage/resizing'
import { HoliImageProps } from '@holi/ui/components/atoms/HoliImage/types'

interface Props extends HoliImageProps {
  // careful, make sure any parameter here works in web as well
  style?: ExpoImageProps['style']
  testID?: ExpoImageProps['testID']
}

const useReactNativeImageForComparison = false

// https://github.com/expo/expo/issues/21921 is fixed, so we can use expo-image again
const HoliImage = ({ source, blurhash, label, style, resizeMode = 'cover', testID }: Props) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !!label,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }

  if (useReactNativeImageForComparison) {
    // no blurhash available
    return (
      <ReactNativeImage
        source={transformSourcesURL(source)}
        style={style}
        resizeMode={resizeMode}
        testID={testID}
        {...accessibilityProps}
      />
    )
  }

  return (
    <ExpoImage
      source={transformSourcesURL(source)}
      placeholder={blurhash}
      style={style}
      contentFit={resizeMode}
      testID={testID}
      {...accessibilityProps}
    />
  )
}

export default HoliImage
