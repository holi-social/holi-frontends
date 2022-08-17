import Image from 'next/image'
import { AccessibilityPropsWeb } from 'packages/ui/@types/reactNativeWeb'
import { StyleType } from 'packages/ui/components/atoms/HoliLocalImage'
import React from 'react'
import { AccessibilityProps } from 'react-native'

// Usage:

// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageFile={PngLogo.src} style={{ width: 50, height: 50 }} altText="some alt text" />
// or
// <HoliLocalImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} altText="some alt text" />

// TODO: intermediate fix until
// https://github.com/vercel/next.js/issues/29788
type StaticImageData = {
  src?: string
  height?: number
  width?: number
  blurDataURL?: string
  default?: { src: string }
}

type HoliLocalImageProps = {
  imageSource: StaticImageData
  // we need the hint if the image source is an svg because for images defined via require()-calls, we can't know
  isSvg?: boolean
  altText?: string
  isDecorative?: boolean
  style?: StyleType
}

const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  altText = '',
  isDecorative = false,
  // TODO: why only apply width and height?
  style = { width: 50, height: 50 },
}: HoliLocalImageProps) => {
  const pathFromRequire = imageSource.src
  const pathFromImport = imageSource.default?.src
  const path = pathFromRequire || pathFromImport || `/${imageSource}`

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: false,
    accessibilityRole: 'image',
    accessibilityLabel: altText,
    ...(isDecorative
      ? {
          // TODO correct?
          accessibilityElementsHidden: true,
        }
      : {}),
  }

  // https://github.com/vercel/next.js/discussions/18312
  return (
    <Image
      {...accessibilityProps}
      src={path as string}
      alt={altText}
      width={style.width}
      height={style.height}
      style={style}
    />
  )
}

export default HoliLocalImage
