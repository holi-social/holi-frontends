import { Image } from 'expo-image'
import type { ImageProps } from 'expo-image'
import React from 'react'
import type { AccessibilityProps } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import type { HoliImageProps } from '@holi/ui/components/utils/image'
import { transformSourcesURL } from '@holi/ui/components/utils/image'

const HoliImage = ({ source, label, style, resizeMode = 'cover', blurHash, testID }: HoliImageProps & ImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !!label,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }

  return (
    <Image
      source={transformSourcesURL(source)}
      style={[style]}
      contentFit={resizeMode}
      placeholder={blurHash}
      testID={testID}
      {...accessibilityProps}
    />
  )
}

export default HoliImage
