import Image from 'next/image'
import React from 'react'

import { HoliLocalImageProps } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import { resizeModeForWeb } from '@holi/ui/components/atoms/imageUtils'

// Usage:
// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageSource={PngLogo} width={30} height={30} label="some alt text" />
// <HoliLocalImage imageSource={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} width={30} height={30} label="some alt text" />

const HoliLocalImage: React.VoidFunctionComponent<HoliLocalImageProps> = ({
  imageSource,
  label,
  width,
  height,
  resizeMode = 'cover',
}: HoliLocalImageProps) => {
  const pathFromRequire = imageSource.src
  const pathFromImport = imageSource.default?.src
  const path = pathFromRequire || pathFromImport || `/${imageSource}`

  return (
    <Image src={path as string} alt={label} width={width} height={height} objectFit={resizeModeForWeb(resizeMode)} />
  )
}

export default HoliLocalImage
