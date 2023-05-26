// TODO: remove this component after Expo Image performance will be fixed for Android
import React from 'react'
import { Image, ImageProps } from 'react-native'
import type { AccessibilityProps } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import type { HoliImageProps } from '@holi/ui/components/utils/image'
import { transformSourcesURL } from '@holi/ui/components/utils/image'

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
