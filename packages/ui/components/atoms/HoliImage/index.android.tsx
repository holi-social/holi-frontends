// TODO: remove this component after Expo Image performance will be fixed for Android
import React from 'react'
import { Image, ImageProps } from 'react-native'
import type { AccessibilityProps } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { transformSourcesURL } from '@holi/ui/components/atoms/HoliImage/image'
import { HoliImageProps } from '@holi/ui/components/atoms/HoliImage/types'

// TODO: React-native Image doesn't manage SVG and blurhash.
// Unify the HoliImage component with Expo-Image
// after the release of the Android regression fix.
// https://github.com/expo/expo/issues/21921
const HoliImage = ({ source, label, style, resizeMode = 'cover', testID }: HoliImageProps & ImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !!label,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }

  return (
    <Image
      source={transformSourcesURL(source)}
      style={style}
      resizeMode={resizeMode}
      testID={testID}
      {...accessibilityProps}
    />
  )
}

export default HoliImage
