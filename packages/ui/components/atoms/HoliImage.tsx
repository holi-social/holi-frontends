import React from 'react'
import { AccessibilityProps, Image, ImageProps } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { HoliImageProps } from '@holi/ui/components/atoms/HoliImage.shared'

const HoliImage: React.VoidFunctionComponent<HoliImageProps & ImageProps> = ({
  source,
  label,
  style,
  resizeMode = 'cover',
  ...nativeImageProps
}: HoliImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: false,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }
  return <Image {...accessibilityProps} source={source} style={[style, { resizeMode }]} {...nativeImageProps} />
}

export default HoliImage
