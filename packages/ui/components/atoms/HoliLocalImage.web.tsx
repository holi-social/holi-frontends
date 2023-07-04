import Image from 'next/image'
import React from 'react'
import { View } from 'react-native'

import { HoliLocalImageProps } from '@holi/ui/components/atoms/HoliLocalImage.shared'

// Usage:
// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageSource={PngLogo} width={30} height={30} label="some alt text" />
// <HoliLocalImage imageSource={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} width={30} height={30} label="some alt text" />

const HoliLocalImage = ({ imageSource, label, width, height, style, resizeMode = 'cover' }: HoliLocalImageProps) => {
  const pathFromRequire = imageSource.src
  const pathFromImport = imageSource.default?.src
  const path = pathFromRequire || pathFromImport || `/${imageSource}`

  // TODO sometimes we already use resizeMode="stretch", but it's not a valid value in next
  return (
    <View style={style}>
      <Image src={path as string} alt={label} width={width} height={height} objectFit={resizeMode} />
    </View>
  )
}

export default HoliLocalImage
