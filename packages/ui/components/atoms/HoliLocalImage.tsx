import { AccessibilityPropsWeb } from 'packages/ui/@types/reactNativeWeb'
import { HoliLocalImageProps } from 'packages/ui/components/atoms/HoliLocalImage.shared'
import React from 'react'
import { AccessibilityProps, Image } from 'react-native'
// TODO: "no exported member" !!!!!!!!!!!!!!!!!!!!
// https://github.com/react-native-svg/react-native-svg/pull/1443
// @ts-ignore
import { WithLocalSvg } from 'react-native-svg'

// Usage:
// <HoliLocalImage imageFile={PngLogo} style={{ width: 30, height: 30 }} altText="some alt text" />
// <HoliLocalImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} style={{ width: 50, height: 50 }} altText="some alt text" />

// TODO: use this implementation to distinguish between require() and {uri: 'http:someImageurl'}
// https://gist.github.com/cryser29/9320f782562af06fb06082b1fce29094
const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  isSvg = false,
  label,
  width,
  height,
  style,
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
      style={[{ resizeMode: 'cover' }, style]}
    />
  ) : (
    <Image
      {...accessibilityProps}
      source={imageSource}
      style={[{ overflow: 'visible', resizeMode: 'cover' }, style, { width, height }]}
    />
  )
}

export default HoliLocalImage
