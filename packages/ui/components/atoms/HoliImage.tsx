import { Image } from 'expo-image'
import React from 'react'
import type { ImageProps } from 'react-native'

import type { HoliImageProps } from '@holi/ui/components/utils/image'
import { transformSourcesURL } from '@holi/ui/components/utils/image'

const HoliImage = ({ source, label, style, resizeMode = 'cover', blurHash, testID }: HoliImageProps & ImageProps) => {
  return (
    <Image
      source={transformSourcesURL(source)}
      style={[style]}
      contentFit={resizeMode}
      placeholder={blurHash}
      testID={testID}
      accessible={!!label}
      accessibilityRole="image"
      accessibilityLabel={label}
    />
  )
}

export default HoliImage
