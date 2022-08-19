import Image from 'next/image'
import { HoliLocalImageProps, setDefaultResizeMode } from 'packages/ui/components/atoms/HoliLocalImage'
import React from 'react'

// Usage:

// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageFile={PngLogo.src} style={{ width: 50, height: 50 }} altText="some alt text" />
// or
// <HoliLocalImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} altText="some alt text" />

const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  label = '',
  width,
  height,
  style,
}: HoliLocalImageProps) => {
  const pathFromRequire = imageSource.src
  const pathFromImport = imageSource.default?.src
  const path = pathFromRequire || pathFromImport || `/${imageSource}`
  const styleWithResizeMode = setDefaultResizeMode(style)

  //  if (width && height) {
  return <Image src={path as string} alt={label} width={width} height={height} style={styleWithResizeMode} />
  //  } else {
  //    return <Image src={path as string} alt={label} layout="fill" style={styleWithResizeMode} />
  //  }

  // https://github.com/vercel/next.js/discussions/18312
  //return <Image src={path as string} alt={label} width={width} height={height} style={style} />
}

export default HoliLocalImage
