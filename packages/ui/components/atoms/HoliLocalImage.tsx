import { AccessibilityPropsWeb } from 'packages/ui/@types/reactNativeWeb'
import React from 'react'
import { AccessibilityProps, Image, ImageSourcePropType } from 'react-native'
// TODO: "no exported member" !!!!!!!!!!!!!!!!!!!!
// https://github.com/react-native-svg/react-native-svg/pull/1443
// @ts-ignore
import { WithLocalSvg } from 'react-native-svg'

// Usage:
// <HoliLocalImage imageFile={PngLogo} style={{ width: 30, height: 30 }} altText="some alt text" />
// <HoliLocalImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} style={{ width: 50, height: 50 }} altText="some alt text" />

export type StyleType = Record<string, string | number> & {
  width?: number
  height?: number
}
interface HoliLocalImageProps {
  imageSource: ImageSourcePropType
  // we need the hint if the image source is an svg because for images defined via require()-calls, we can't know
  isSvg?: boolean
  altText?: string
  isDecorative?: boolean
  style?: StyleType
}

// TODO: use this implementation to distinguish between require() and {uri: 'http:someImageurl'}
// https://gist.github.com/cryser29/9320f782562af06fb06082b1fce29094
const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  isSvg = false,
  altText = '',
  isDecorative = false,
  // TODO: why only apply to svg?
  style = { width: 50, height: 50 },
}: HoliLocalImageProps) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: false,
    accessibilityRole: 'image',
    ...(isDecorative
      ? {
          // TODO correct?
          accessibilityElementsHidden: true,
        }
      : {
          // TODO only non-decorative?
          accessibilityLabel: altText,
        }),
  }

  return isSvg ? (
    <WithLocalSvg {...accessibilityProps} asset={imageSource} width={style.width} height={style.height} />
  ) : (
    // TODO: why only apply size to svg?

    <Image {...accessibilityProps} source={imageSource} style={{ overflow: 'visible' }} />
  )
}

export default HoliLocalImage
