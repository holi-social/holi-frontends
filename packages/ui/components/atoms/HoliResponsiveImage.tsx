import React from 'react'
import { AccessibilityProps, Image } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { HoliResponsiveImageProps } from '@holi/ui/components/atoms/HoliResponsiveImage.shared'

const HoliResponsiveImage: React.VoidFunctionComponent<HoliResponsiveImageProps> = ({
  sources,
  label,
  style,
  resizeMode = 'cover',
}: HoliResponsiveImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: false,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }
  return <Image {...accessibilityProps} source={sources} style={[style, { resizeMode }]} />
}

export default HoliResponsiveImage
