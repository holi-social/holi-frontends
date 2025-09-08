import Image from 'next/image'
import React from 'react'
import { View } from 'react-native'

import type { HoliLocalImageProps } from '@holi/ui/components/atoms/HoliLocalImage.shared'

// Usage:
// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <HoliLocalImage imageSource={PngLogo} width={30} height={30} label="some alt text" />
// <HoliLocalImage imageSource={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} width={30} height={30} label="some alt text" />

/**
 * @deprecated Use `Image` from holiBricks instead.
 */
const HoliLocalImage = ({ imageSource, label, width, height, style, resizeMode = 'cover' }: HoliLocalImageProps) => {
  if (!imageSource) return <></> // Avoid crashes in case of icon missing in our Iconset
  const webResizeMode = resizeMode === 'stretch' ? 'fill' : resizeMode

  return (
    // @ts-ignore
    <View style={style}>
      <Image
        src={imageSource as string}
        alt={label}
        width={width}
        height={height}
        style={{ objectFit: webResizeMode }}
      />
    </View>
  )
}

export default HoliLocalImage
