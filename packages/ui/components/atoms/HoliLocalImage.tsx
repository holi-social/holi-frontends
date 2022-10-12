import React from 'react'
import { AccessibilityProps, Image } from 'react-native'
// TODO: "no exported member" !!!!!!!!!!!!!!!!!!!!
// https://github.com/react-native-svg/react-native-svg/pull/1443
// @ts-ignore
import { WithLocalSvg } from 'react-native-svg'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { HoliLocalImageProps } from '@holi/ui/components/atoms/HoliLocalImage.shared'

// Usage:
// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageSource={PngLogo} width={30} height={30} label="some alt text" />
// <HoliLocalImage imageSource={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} width={30} height={30} label="some alt text" />

// TODO: use this implementation to distinguish between require() and {uri: 'http:someImageurl'}
// https://gist.github.com/cryser29/9320f782562af06fb06082b1fce29094
const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  isSvg = false,
  label,
  width,
  height,
  style,
  resizeMode = 'cover',
}: HoliLocalImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: false,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }

  return isSvg ? (
    <WithLocalSvg
      {...accessibilityProps}
      asset={imageSource}
      width={width}
      height={height}
      style={[{ resizeMode: resizeMode }, style]}
    />
  ) : (
    <Image
      {...accessibilityProps}
      source={imageSource}
      style={[{ overflow: 'visible', resizeMode: resizeMode }, style, { width, height }]}
    />
  )
}

export default HoliLocalImage
