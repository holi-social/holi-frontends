import { Image } from 'expo-image'
import type { ImageProps } from 'expo-image'
import React from 'react'
import type { AccessibilityProps } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { transformSourcesURL } from '@holi/ui/components/atoms/HoliImage/image'
import { HoliImageProps } from '@holi/ui/components/atoms/HoliImage/types'

// TODO: Unify the HoliImage component with Expo-Image
// after the release of the Android regression fix.
// https://github.com/expo/expo/issues/21921
const HoliImage = ({ source, blurhash, label, style, resizeMode = 'cover', testID }: HoliImageProps & ImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !!label,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }

  return (
    <Image
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
