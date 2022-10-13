import React from 'react'
import { AccessibilityProps, Image } from 'react-native'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { HoliImageProps } from '@holi/ui/components/atoms/HoliImage.shared'

const HoliImage: React.VoidFunctionComponent<HoliImageProps> = ({
  source,
  label,
  style,
  resizeMode = 'cover',
}: HoliImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: false,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }
  return <Image {...accessibilityProps} source={source} style={[style, { resizeMode }]} />
}

export default HoliImage
