import Image from 'next/image'
import { HoliLocalImageProps, ResizeMode } from 'packages/ui/components/atoms/HoliLocalImage.shared'
import React from 'react'

// Usage:
// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageSource={PngLogo} width={30} height={30} label="some alt text" />
// <HoliLocalImage imageSource={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} width={30} height={30} label="some alt text" />

const resizeModeToObjectFit = (resizeMode: ResizeMode): 'cover' | 'contain' | 'fill' => {
  switch (resizeMode) {
    case 'stretch':
      return 'fill'
    default:
      return resizeMode
  }
}

const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  label,
  width,
  height,
  style,
  resizeMode = 'cover',
}: HoliLocalImageProps) => {
  const pathFromRequire = imageSource.src
  const pathFromImport = imageSource.default?.src
  const path = pathFromRequire || pathFromImport || `/${imageSource}`

  //  if (width && height) {
  return (
    <Image
      src={path as string}
      alt={label}
      width={width}
      height={height}
      objectFit={resizeModeToObjectFit(resizeMode)}
      style={style}
    />
  )
  //  } else {
  //    return <Image src={path as string} alt={label} layout="fill" style={styleWithResizeMode} />
  //  }
}

export default HoliLocalImage
