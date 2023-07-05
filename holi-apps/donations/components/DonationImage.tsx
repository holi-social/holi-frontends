import React from 'react'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { ImageSource, MobileImageProps, ResizeMode, WebImageProps } from '@holi/ui/components/atoms/HoliImage/types'

import { Picture } from '@holi-apps/donations/typings'

type DonationImageProps = {
  picture: Picture[]
  label: string
  style?: MobileImageProps['style'] & WebImageProps['style']
  resizeMode?: ResizeMode
  sizes?: string
}

const DonationImage: React.VFC<DonationImageProps> = ({
  picture,
  label,
  style,
  resizeMode,
  sizes,
}: DonationImageProps) => {
  const sources: ImageSource[] = picture
    .filter((picture) => !!picture.width && !!picture.height)
    .map((picture) => ({
      uri: picture.url,
      // We already ensure the size above
      width: picture.width || 0,
      height: picture.height || 0,
    }))
  const originalUrl = picture.find(({ type }) => type === 'original')?.url

  return (
    <HoliImage
      source={sources.length ? sources : originalUrl ? { uri: originalUrl } : []}
      label={label}
      style={style}
      resizeMode={resizeMode}
      sizes={sizes}
    />
  )
}

export default DonationImage
